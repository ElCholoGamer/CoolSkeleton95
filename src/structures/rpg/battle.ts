import { User, TextChannel, MessageEmbed, MessageReaction } from 'discord.js';
import Monster from './monster';
import { embedColor } from '../../config.json';
import Player from './player';

interface BattleOptions {
	user: User;
	channel: TextChannel;
	monster: Monster;
}

class Battle {
	private _turn = 0;

	private constructor(
		public readonly player: Player,
		public readonly channel: TextChannel,
		public readonly monster: Monster
	) {}

	public static async init({ user, channel, monster }: BattleOptions) {
		const player = await Player.init(user);
		return new this(player, channel, monster);
	}

	public get turn() {
		return this._turn;
	}

	public async start() {
		this.player.user.inBattle = true;
		await this.monster.onSpawn(this);

		this.nextTurn();
	}

	private nextTurn() {
		this._turn++;
		this.showMainMenu();
	}

	private async showMainMenu(): Promise<void> {
		const emojis = ['⚔️', '🗣️', '💰', '❌'];
		const dialog = await this.monster.getBattleDialog(this);

		const doc = await this.player.user.getDocument();

		const embed = new MessageEmbed()
			.setColor(embedColor)
			.setTitle('Undertale battle')
			.setDescription(
				[
					'```',
					dialog,
					'```',
					'**HP:**',
					`You: \`${doc.hp} / 20\``,
					`${this.monster.name} \`${this.monster.hp} / ${this.monster.fullHP}\``,
					'',
					`\`FIGHT\` - ${emojis[0]}`,
					`\`ACT\` - ${emojis[1]}`,
					`\`ITEM\` - ${emojis[2]}`,
					`\`MERCY\` - ${emojis[3]}`,
				].join('\n')
			)
			.setFooter('React with an emoji to continue');

		const message = await this.channel.send(embed);
		for (const emoji of emojis) {
			message.react(emoji).catch(() => null);
		}

		const collected = await message.awaitReactions(
			(r: MessageReaction, u: User) =>
				emojis.includes(r.emoji.name) && u.id === this.player.user.id,
			{ max: 1, time: 1 * 60 * 60 * 1000 }
		);

		await message.delete().catch(() => null);

		const response = collected.first();
		if (!response) return this.end('Time limit exceeded');

		let next: boolean;
		switch (emojis.indexOf(response.emoji.name)) {
			case 0:
				const damage = await this.player.fight(this);
				await this.channel.send(
					new MessageEmbed()
						.setColor(embedColor)
						.setDescription(
							`You strike **${this.monster.name}** and deal ${damage} damage.`
						)
				);
				next = true;
				break;
			case 1:
				next = await this.player.act(this);
				break;
			case 2:
				// ITEM
				next = await this.player.item(this);
				break;
			case 3:
				next = await this.player.mercy(this);
				break;
			default:
				next = true;
		}

		if (!next) return this.showMainMenu();

		this.nextTurn();
	}

	public async end(message: string) {
		this.player.user.inBattle = false;

		await this.channel.send(
			new MessageEmbed().setColor(embedColor).setDescription(message)
		);
	}
}

export default Battle;
