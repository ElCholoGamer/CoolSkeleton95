import { User } from 'discord.js';
import Item, { ItemType } from '../../structures/rpg/item';

class SpiderCider extends Item {
	public constructor() {
		super({
			id: 10,
			name: 'Spider Cider',
			description: 'Made with whole spiders, not just the juice.',
			price: 18,
			type: ItemType.CONSUMABLE,
		});
	}

	public async onBuy(user: User, amount: number) {
		const displayAmount = amount === 1 ? 'a jug' : `${amount} jugs`;
		return `Some spiders crawled down and gave you ${displayAmount}.`;
	}

	public async use(user: User) {
		await user.heal(24);
		return 'You drank the Spider Cider.';
	}
}

export default SpiderCider;
