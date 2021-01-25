import {
	User,
	TextChannel,
	MessageReaction,
	MessageAttachment,
} from 'discord.js';
import Monster from './monster';
import Player from './player';
import { sleep } from '../../util/utils';
import DialogGenerator from '../../util/dialog-generator';

interface BattleOptions {
	user: User;
	channel: TextChannel;
	monster: Monster;
}

class Battle {
	private _turn = 0;
	private ended = false;

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
		const dialog = await this.monster.getFlavorText(this);

		const doc = await this.player.user.getDocument();

		const embed = this.dialogGenerator
			.embedDialog(dialog)
			.setTitle('Battle')
			.setDescription(
				[
					'**HP:**',
					`You: \`${doc.hp} / 20\``,
					`${this.monster.name}: \`${this.monster.hp} / ${this.monster.fullHP}\``,
					'',
					`${emojis[0]} - \`FIGHT\``,
					`${emojis[1]} - \`ACT\``,
					`${emojis[2]} - \`ITEM\``,
					`${emojis[3]} - \`MERCY\``,
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

		// Choose action from reaction
		let next = true;
		let doAttackDialog = true;
		switch (emojis.indexOf(response.emoji.name)) {
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
				const actResponse = await this.player.act(this);
				next = actResponse.next;
				doAttackDialog = actResponse.doAttackDialog ?? doAttackDialog;
				break;
			case 2:
				next = await this.player.item(this);
				break;
			case 3:
				next = await this.player.mercy(this);
		}

		if (!next) return this.showMainMenu();
		if (this.ended) return;

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
		if (doAttackDialog) {
			const attackDialog = await this.monster.getAttackQuote(this);
			if (attackDialog) {
				await this.channel.send(
					this.dialogGenerator.embedDialog(attackDialog, this.monster.image)
				);
				await sleep(1000);
			}
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
