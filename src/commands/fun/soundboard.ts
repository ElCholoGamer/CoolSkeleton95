import { MessageEmbed, MessageReaction, User } from 'discord.js';
import { basename } from 'path';
import Category from '../../structures/category';
import Command from '../../structures/command/command';
import CommandEvent from '../../structures/command/command-event';
import CommandHandler from '../../structures/command/command-handler';
import { readFullDir, removeExtension } from '../../util/utils';
import { embedColor } from '../../config.json';
import { NUMBERS, NUMBER_EMOJIS } from '../../util/constants';

interface Sound {
	name: string;
	path: string;
}

class Soundboard extends Command {
	private readonly pages: Sound[][] = [];
	private readonly PAGE_LIMIT = 5;

	public constructor(handler: CommandHandler) {
		super(
			'soundboard',
			'JOINS A VOICE CHANNEL TO PLAY SOME SOUNDS.',
			Category.FUN,
			handler,
			{ selfPermissions: ['CONNECT', 'SPEAK', 'DEAFEN_MEMBERS'] }
		);

		this.loadSounds();
	}

	private async loadSounds() {
		const files = await readFullDir('./assets/audio/soundboard');
		const sounds = files.map(file => ({
			path: file,
			name: removeExtension(basename(file))
				.replace(/(-|_)/g, ' ')
				.replace(/(^| )[a-z]/g, s => s.toUpperCase()),
		}));

		const pages = sounds.reduce<Sound[][]>((acc, sound, index) => {
			if (index % this.PAGE_LIMIT === 0) {
				acc.push([sound]);
			} else {
				acc[acc.length - 1].push(sound);
			}
			return acc;
		}, []);

		this.pages.push(...pages);
	}

	private getPageNumber(embed: MessageEmbed): number {
		if (!embed.footer?.text) return NaN;

		return Number(embed.footer.text.match(/[0-9]+/)) - 1;
	}

	private getSoundsEmbed(page = 0): MessageEmbed {
		return new MessageEmbed()
			.setColor(embedColor)
			.setTitle('SOUNDBOARD LIST')
			.setDescription(
				this.pages[page].map(
					(sound, index) => `:${NUMBERS[index + 1]}: - ${sound.name}`
				)
			)
			.setFooter(`PAGE ${page + 1} OUT OF ${this.pages.length}`);
	}

	public async execute({ member, guild, channel }: CommandEvent) {
		const self = guild.me;
		if (!self) return;

		let { channel: vc } = self.voice;

		if (!vc) {
			// Join the member's voice channel
			vc = member.voice.channel;
			if (!vc) return await channel.send('YOU NEED TO BE IN A VOICE CHANNEL!');

			await channel.send(`JOINING **${vc.name}**...`);
			await vc.join();

			if (self.voice.selfDeaf) await self.voice.setSelfDeaf(true);
		} else if (vc.id !== member.voice.channel?.id) {
			return await channel.send(
				`YOU HAVE TO BE IN THE SAME VOICE CHANNEL AS ME! (**${vc.name}**)`
			);
		}

		const embed = this.getSoundsEmbed();
		const message = await channel.send(embed);

		const arrows = ['⬅', '➡'];
		const numbers = NUMBER_EMOJIS.slice(1, 1 + this.PAGE_LIMIT);
		const fullEmojis = [arrows[0], ...numbers, arrows[1], '❌'];

		const collector = message.createReactionCollector(
			(reaction: MessageReaction, user: User) =>
				fullEmojis.includes(reaction.emoji.name) &&
				user.id !== self.id &&
				guild.member(user)?.voice.channel?.id === vc?.id
		);

		collector.on('collect', async (reaction, user) => {
			const { connection } = self.voice;
			if (!connection) return;

			// Remove reaction
			const emoji = reaction.emoji.name;
			if (fullEmojis.includes(emoji)) {
				reaction.users.remove(user).catch(() => null);
			}

			if (emoji === fullEmojis[fullEmojis.length - 1]) {
				// Stop soundboard
				collector.stop();
				connection.disconnect();
				message.edit(
					new MessageEmbed()
						.setColor(embedColor)
						.setDescription('SOUNDBOARD CLOSED!')
				);
				return await message.reactions.removeAll();
			}

			let currentPage = this.getPageNumber(message.embeds[0]);
			const arrowsIndex = arrows.indexOf(emoji);

			if (arrowsIndex !== -1) {
				// Change page index
				currentPage += arrowsIndex || -1;
				if (currentPage < 0 || currentPage >= this.pages.length) return;

				const newEmbed = this.getSoundsEmbed(currentPage);
				await message.edit(newEmbed);
			} else {
				// Play a sound
				const numberIndex = numbers.indexOf(emoji);
				if (numberIndex === -1) return;

				const sound = this.pages[currentPage][numberIndex];
				if (sound) connection.play(sound.path);
			}
		});

		fullEmojis.forEach(emoji => message.react(emoji));
	}
}

export default Soundboard;
