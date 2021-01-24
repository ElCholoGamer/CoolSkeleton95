import Monster from '../structures/rpg/monster';

class Froggit extends Monster {
	public constructor() {
		super({
			name: 'Froggit',
			description: 'Life is difficult for this enemy.',
			fullHP: 30,
			image: 'froggit.gif',
		});
	}

	public getAttack() {
		return 4;
	}

	public getDefense() {
		return 5;
	}

	public getXP() {
		return 3;
	}

	public getGold() {
		return 2;
	}

	getActOptions() {
		return {};
	}
}

export default Froggit;
