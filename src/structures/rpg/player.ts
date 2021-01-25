import { User, MessageEmbed } from 'discord.js';
import { IUser } from '../../models/user';
import { NUMBERS, NUMBER_EMOJIS } from '../../util/constants';
import Battle from './battle';
import { embedColor } from '../../config.json';
import { MessageReaction } from 'discord.js';
import { sleep } from '../../util/utils';

class Player {
	public constructor(public readonly user: User, private readonly doc: IUser) {}

	public static async init(user: User) {
		const doc = await user.getDocument();
		return new this(user, doc);
	}

	public async fight(battle: Battle): Promise<number> {
		const damage = Math.randomInt(3, 6);
		battle.monster.hp -= damage;

		return damage;
	}

	public async act(battle: Battle): Promise<boolean> {
		const { monster, channel } = battle;

		const at = await monster.getAttack(battle);
		const def = await monster.getDefense(battle);

		const options = await monster.getActOptions(battle);
		options.unshift({
			name: 'Check',
			execute: () =>
				[
					`**${monster.name.toUpperCase()}** - AT ${at} DEF ${def}`,
					monster.description,
				].join('\n'),
		});

		const optionEmojis = options.map((k, index) => NUMBER_EMOJIS[index + 1]);
		const emojis = ['◀️', ...optionEmojis];

		const message = await channel.send(
			new MessageEmbed()
				.setColor(embedColor)
				.setTitle('ACT Menu')
				.setDescription(
					options
						.map((opt, index) => `**${opt.name}** - :${NUMBERS[index + 1]}:`)
						.join('\n')
				)
		);

		for (const emoji of emojis) {
			message.react(emoji).catch(() => null);
		}

		const collected = await message.awaitReactions(
			(m: MessageReaction, u: User) =>
				emojis.includes(m.emoji.name) && u.id === this.user.id,
			{ max: 1, time: 1 * 60 * 60 * 1000 }
		);

		await message.delete().catch(() => null);

		const first = collected.first();
		if (!first || first.emoji.name === emojis[0]) return false;

		const index = optionEmojis.indexOf(first.emoji.name);
		if (index === -1) return false;

		const dialog = await options[index].execute.call(monster, battle);

		await channel.send(
			new MessageEmbed().setColor(embedColor).setDescription(dialog)
		);
		await sleep(3000);

		return true;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public async item(battle: Battle): Promise<boolean> {
		// TODO
		return false;
	}

	public async mercy(battle: Battle): Promise<boolean> {
		const {
			channel,
			monster: { spareable, fleeable },
		} = battle;

		const emojis = ['◀️', '', ''];
		if (spareable) emojis[1] = '❌';
		if (fleeable) emojis[2] = '🚪';

		const message = await channel.send(
			new MessageEmbed()
				.setColor(embedColor)
				.setTitle('MERCY')
				.setDescription(
					[
						emojis[1] ? `**Spare** - ${emojis[1]}` : '~~Spare~~',
						emojis[2] ? `**Flee** - ${emojis[2]}` : '~~Flee~~',
					].join('\n')
				)
		);

		for (const emoji of emojis) {
			if (emoji) message.react(emoji).catch(() => null);
		}

		const collected = await message.awaitReactions(
			(r: MessageReaction, u: User) =>
				emojis.includes(r.emoji.name) && u.id === this.user.id,
			{ max: 1, time: 1 * 60 * 60 * 1000 }
		);

		await message.delete().catch(() => null);

		const first = collected.first();
		if (!first || first.emoji.name === emojis[0]) return false;

		switch (first.emoji.name) {
			case '❌':
				// TODO
				break;
			case '🚪':
				// TODO
				break;
		}

		return true;
	}

	public async heal(amount: number, save = true) {
		this.doc.hp = Math.clamp(this.doc.hp + amount, 0, 20);
		if (save) await this.doc.save();
	}

	public damage(amount: number, save = true) {
		return this.heal(-amount, save);
	}
}

export default Player;
