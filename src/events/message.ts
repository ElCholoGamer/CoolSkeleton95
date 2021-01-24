import {
	Client,
	Message,
	TextChannel,
	MessageEmbed,
	MessageAttachment,
} from 'discord.js';
import { join } from 'path';
import EventHandler from '../structures/event-handler';
import { prefix, embedColor, battleChance } from '../config.json';
import { readFullDir } from '../util/utils';
import Monster, { ExampleMonster } from '../structures/rpg/monster';

class MessageHandler extends EventHandler('message') {
	private readonly monsters: typeof ExampleMonster[] = [];

	public constructor(client: Client) {
		super(client);
		this.loadMonsters();
	}

	private async loadMonsters() {
		const monsterFiles = await readFullDir(join(__dirname, '../monsters'));
		await Promise.all(
			monsterFiles.map(async file => {
				const MonsterConstructor = (await import(file)).default;
				if (
					typeof MonsterConstructor !== 'function' ||
					!(new MonsterConstructor() instanceof Monster)
				)
					return;

				this.monsters.push(MonsterConstructor);
			})
		);
	}

	public async execute({ author, content, guild, client }: Message) {
		if (
			!this.monsters.length ||
			author.bot ||
			content.toLowerCase().startsWith(prefix.toLowerCase()) ||
			!guild ||
			Math.random() > battleChance
		)
			return;

		const { rpgChannel } = await guild.getDocument();
		if (!rpgChannel) return;

		const channel = await client.channels.fetch(rpgChannel);
		if (!(channel instanceof TextChannel)) return;

		const MonsterConstructor = this.monsters.random();
		const monster = new MonsterConstructor();

		const embed = new MessageEmbed()
			.setColor(embedColor)
			.setDescription(`A wild **${monster.name}** draws near!`);

		const { image } = monster;
		if (image) {
			const attachment = new MessageAttachment(
				`./assets/img/monsters/${image}`,
				image
			);
			embed.attachFiles([attachment]).setImage(`attachment://${image}`);
		}

		await channel.send(embed);
	}
}

export default MessageHandler;
