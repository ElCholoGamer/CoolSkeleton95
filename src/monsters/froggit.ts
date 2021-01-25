import Battle from '../structures/rpg/battle';
import Monster, { ActOption } from '../structures/rpg/monster';

class Froggit extends Monster {
	public constructor() {
		super({
			name: 'Froggit',
			description: 'Life is difficult for this enemy.',
			fullHP: 30,
			image: 'froggit.gif',
		});
	}

	public getAttack = () => 4;
	public getDefense = () => 5;
	public getXP = () => 3;
	public getGold = () => 2;

	public async getBattleDialog(battle: Battle) {
		if (battle.turn === 1) {
			const doc = await battle.player.user.getDocument();
			return doc.gold === 0 ? 'Froggit attacks you!' : 'Froggit hopped close!';
		}

		if (this.spareable) return 'Froggit seems reluctant to fight you.';
		if (this.hp < 5) return 'Froggit is trying to run away.';

		return [
			"You are intimidated by Froggit's raw strength.",
			"You are intimidated by Froggit's raw strength. Only kidding.",
			'Froggit hops to and fro.',
			'The battlefield is filled with the smell of mustard seed.',
			"Froggit doesn't seem to know why it's here.",
		].random();
	}

	public getActOptions() {
		const opts: ActOption[] = [
			{
				name: 'Compliment',
				execute: () =>
					"Froggit didn't understand what you said, but was flattered anyway.",
			},
			{
				name: 'Scare',
				execute: () =>
					"Froggit didn't understand what you said, but was scared anyway.",
			},
		];

		return opts;
	}
}

export default Froggit;
