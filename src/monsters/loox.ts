import Battle from '../structures/rpg/battle';
import Monster, { ActOption } from '../structures/rpg/monster';

class Loox extends Monster {
	private timesPickedOn = 0;

	public constructor() {
		super({
			name: 'Loox',
			description: "Don't pick on him. Family name: Eyewalker.",
			fullHP: 50,
			image: 'loox.gif',
		});
	}

	public getAttack = (check: boolean) => (check ? 5 : 5 + this.timesPickedOn);
	public getDefense = () => 4;
	public getXP = () => 7 + 5 * Math.min(this.timesPickedOn, 3);
	public getGold = () => 5;

	public getFlavorText(battle: Battle) {
		if (battle.turn === 1) return 'Loox drew near!';
		if (this.hp < 10) return 'Loox is watering.';

		return [
			'Loox is staring right through you.',
			'Loox is gazing at you.',
			'Loox gnashes its teeth.',
			'Smells like eyedrops.',
		].random();
	}

	public getAttackQuote(battle: Battle) {
		if (battle.turn === 1) {
			if (this.spareable) return undefined;
			return "Please don't pick on me.";
		}

		return [
			'Quit staring at me.',
			"I've got my eye on you.",
			'How about a staring contest?',
			"Don't point that at me.",
			'What an eyesore.',
		].random();
	}

	public getActOptions() {
		const opts: ActOption[] = [
			{
				name: 'Pick On',
				execute: () => {
					this.timesPickedOn++;
					return { message: 'You rude little snipe!', isDialog: true };
				},
			},
			{
				name: "Don't Pick On",
				execute: () => {
					this._spareable = true;
					return { message: 'Finally someone gets it.', isDialog: true };
				},
			},
		];

		return opts;
	}
}

export default Loox;
