import Battle from '../structures/rpg/battle';
import Monster, { ActOption } from '../structures/rpg/monster';

class Vegetoid extends Monster {
	private ateGreens = false;

	public constructor() {
		super({
			name: 'Vegetoid',
			description: 'Serving Size: 1 Monster. Not monitored by the USDA.',
			fullHP: 70,
			image: 'vegetoid.gif',
		});
	}

	public getAttack = () => 5;
	public getDefense = (check: boolean) => (check ? 6 : 0);
	public getXP = () => 6;
	public getGold = (spared: boolean) => (spared ? 4 : 1);

	public getAttackDialog() {
		if (this.spareable) {
			if (this.ateGreens) return 'Ate Your Greens';

			this.ateGreens = true;
			return 'Eat Your Greens';
		}

		return [
			'Farmed Locally, Very Locally',
			'Part Of A Complete Breakfast',
			'Fresh Morning Taste',
			'Contains Vitamin A',
		].random();
	}

	public getBattleDialog(battle: Battle) {
		if (battle.turn === 1) return 'Vegetoid came out of the earth!';
		if (this.hp < 15) return 'Vegetoid seems kind of bruised.';

		return [
			'Vegetoid cackles softly.',
			"Vegetoid's here for your health.",
			'Vegetoid gave a mysterious smile.',
			'It smells like steamed carrots and peas.',
		].random();
	}

	public getActOptions() {
		const opts: ActOption[] = [
			{
				name: 'Talk',
				execute: () => "Plants Can't Talk Dummy",
			},
			{
				name: 'Dinner',
				execute: () => {
					this._spareable = true;
					return undefined;
				},
			},
		];

		return opts;
	}
}

export default Vegetoid;
