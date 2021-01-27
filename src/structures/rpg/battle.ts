import {
	User,
	TextChannel,
	MessageReaction,
	MessageAttachment,
	GuildEmoji,
	ReactionEmoji,
} from 'discord.js';
import Monster from './monster';
import Player from './player';
import { getMaxHP, sleep } from '../../util/utils';
import DialogGenerator from '../../util/dialog-generator';

interface BattleOptions {
	user: User;
	channel: TextChannel;
	monster: Monster;
}

class Battle {
	private _turn = 0;
	private ended = false;
	private readonly emojis = [
		'<:fight:803358237969481788>',
		'<:act:803358238040653895>',
		'<:item:803358237977608242>',
		'<:mercy:803358237956505610>',
	];

	private constructor(
		public readonly player: Player,
		public readonly channel: TextChannel,
		public readonly monster: Monster,
		private readonly dialogGenerator: DialogGenerator
	) {}

	public static async init({ user, channel, monster }: BattleOptions) {
		const player = await Player.init(user);
		const dialogGenerator = await DialogGenerator.init();
		return new this(player, channel, monster, dialogGenerator);
	}

	private findEmojiIndex(emoji: GuildEmoji | ReactionEmoji) {
		return this.emojis.findIndex(e => e === `<:${emoji.name}:${emoji.id}>`);
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
		const dialog = await this.monster.getFlavorText(this);
		const doc = await this.player.user.getDocument();

		const [fight, act, item, mercy] = this.emojis;
		const embed = this.dialogGenerator
			.embedDialog(dialog)
			.setTitle('Battle')
			.setDescription(
				[
					'**HP:**',
					`You: \`${doc.hp} / ${getMaxHP(doc.lv)}\``,
					`${this.monster.name}: \`${this.monster.hp} / ${this.monster.fullHP}\``,
					'',
					`${fight} - \`FIGHT\``,
					`${act} - \`ACT\``,
					`${item} - \`ITEM\``,
					`${mercy} - \`MERCY\``,
				].join('\n')
			);

		const { image } = this.monster;
		if (image) {
			const attachment = new MessageAttachment(
				`./assets/img/monsters/${image}`,
				image
			);
			embed.attachFiles([attachment]).setThumbnail(`attachment://${image}`);
		}

		// Send menu message
		const message = await this.channel.send(embed);
		for (const emoji of this.emojis) {
			message.react(emoji).catch(() => null);
		}

		const collected = await message.awaitReactions(
			(r: MessageReaction, u: User) =>
				this.findEmojiIndex(r.emoji) !== -1 && u.id === this.player.user.id,
			{ max: 1, time: 1 * 60 * 60 * 1000 }
		);

		await message.delete().catch(() => null);

		const response = collected.first();
		if (!response) return this.end('Time limit exceeded');

		// Choose action from reaction
		let next = true;
		const index = this.findEmojiIndex(response.emoji);

		switch (index) {
			case 0:
				const damage = await this.player.fight(this);
				await this.monster.onDamage(damage, this);

				await this.channel.send(
					this.dialogGenerator.embedDialog(
						`You strike ${this.monster.name} and deal ${damage} damage.`
					)
				);
				next = true;
				break;
			case 1:
				next = await this.player.act(this);
				break;
			case 2:
				next = await this.player.item(this);
				break;
			case 3:
				next = await this.player.mercy(this);
		}

		if (this.ended) return;
		if (!next) return this.showMainMenu();

		// Monster dies
		if (this.monster.hp <= 0) {
			const gold = await this.monster.getGold(false, this);
			await this.player.user.addGold(gold);
			await this.monster.onDeath(this);

			return await this.end(
				['YOU WON!', `You earned ${gold} gold.`].join('\n')
			);
		}

		// Send attack dialog
		const attackDialog = await this.monster.getAttackQuote(this);
		if (attackDialog) {
			await this.channel.send(
				this.dialogGenerator.embedDialog(attackDialog, this.monster.image)
			);
			await sleep(1000);
		}

		// Attack player
		const attack = await this.monster.getAttack(false, this);
		if (attack > 0) {
			await this.player.damage(attack);

			await this.channel.send(
				this.dialogGenerator.embedDialog(
					`${this.monster.name.toUpperCase()} dealt ${attack} damage!`
				)
			);
		}

		this.nextTurn();
	}

	public async end(message: string) {
		this.ended = true;
		this.player.user.inBattle = false;

		await this.channel.send(this.dialogGenerator.embedDialog(message));
	}
}

export default Battle;
