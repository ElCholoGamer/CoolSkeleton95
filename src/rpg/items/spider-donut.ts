import { User } from 'discord.js';
import Item from '../../structures/rpg/item';

class SpiderDonut extends Item {
	public constructor() {
		super({
			id: 7,
			name: 'Spider Donut',
			description: 'A donut made with Spider Cider in the batter.',
			price: 7,
		});
	}

	public async onBuy(user: User, amount: number) {
		const displayAmount = amount === 1 ? 'a donut' : `${amount} donuts`;
		return `Some spiders crawled down and gave you ${displayAmount}.`;
	}

	public async use(user: User) {
		await user.heal(12);
		return "Don't worry, spider didn't.";
	}
}

export default SpiderDonut;
