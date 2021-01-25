import Battle from '../structures/rpg/battle';
import Monster, { ActOption } from '../structures/rpg/monster';

class Whimsun extends Monster {
	private terrorized = false;
	private consoled = false;

	public constructor() {
		super({
			name: 'Whimsun',
			description: 'This monster is too sensitive to fight...',
			fullHP: 10,
			image: 'whimsun.gif',
		});

		this._spareable = true;
	}

	public getAttack = (check: boolean) => (check ? 5 : 0);
	public getDefense = () => 0;
	public getXP = () => 2;
	public getGold(spared: boolean) {
		if ((!spared && !this.consoled) || this.terrorized) return 2;
		return 0;
	}

	public onDamage() {
		this.hp = 0;
	}

	public getAttackDialog() {
		if (this.terrorized) return "I can't handle this...";

		return [
			"I'm sorry...",
			'Oh no...',
			'*sniff, sniff*',
			'I have no choice...',
			'Forgive me...',
		].random();
	}

	public getBattleDialog(battle: Battle) {
		if (battle.turn === 1) return 'Whimsun approached meekly!';
		if (this.hp < 3) return 'Whimsun is having trouble flying.';
		if (this.terrorized) return 'Whimsun is hyperventilating.';

		return [
			'Whimsun continues to mutter apologies.',
			'Whimsun avoids eye contact.',
			'Whimsun is fluttering.',
			"It's starting to smell like lavender and mothballs.",
		].random();
	}

	public getActOptions() {
		const opts: ActOption[] = [
			{
				name: 'Console',
				execute: () => {
					this.hp = 0;
					this.consoled = true;
					return 'Halfway through your first word, Whimsun bursts into tears and runs away.';
				},
			},
			{
				name: 'Terrorize',
				execute: () => {
					this.terrorized = true;
					return 'You raise your arms and wiggle your fingers. Whimsun freaks out!';
				},
			},
		];

		return opts;
	}
}

export default Whimsun;
