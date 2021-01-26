import Battle from '../../structures/rpg/battle';
import Monster, { ActOption } from '../../structures/rpg/monster';

class Moldsmal extends Monster {
	private acted = false;

	public constructor() {
		super({
			name: 'Moldsmal',
			description: 'Stereotypical: Curvaceously attractive, but no brains...',
			fullHP: 50,
			image: 'moldsmal.gif',
		});

		this._spareable = true;
	}

	public getAttack = () => 5;
	public getDefense = () => 0;
	public getXP = () => 3;
	public getGold = (spared: boolean) => (!spared ? 3 : this.acted ? 1 : 0);

	public getAttackQuote() {
		return [
			'Squorch...',
			'Burble burb...',
			'*Slime sounds*',
			'*Sexy wiggle*',
		].random();
	}

	public getFlavorText(battle: Battle) {
		if (battle.turn === 1) return 'Moldsmal blocked the way!';
		if (this.hp < 10) return 'Moldsmal has started to spoil.';

		return [
			'Moldsmal waits pensively.',
			'Moldsmal burbles quietly.',
			'Moldsmal is ruminating.',
			'The aroma of lime gelatin wafts through.',
		].random();
	}

	public getActOptions() {
		const opts: ActOption[] = [
			{
				name: 'Imitate',
				execute: () => {
					this.acted = true;
					return 'You lie immobile with Moldsmal. You feel like you understand the world a little better.';
				},
			},
			{
				name: 'Flirt',
				execute: () => {
					this.acted = true;
					return 'You wiggle your hips. Moldsmal wiggles back. What a meaningful conversation!';
				},
			},
		];

		return opts;
	}
}

export default Moldsmal;
