import { User } from 'discord.js';
import Item, { ItemType } from '../../structures/rpg/item';

class NiceCream extends Item {
	public constructor() {
		super({
			id: 17,
			name: 'Nice Cream',
			description: 'Instead of a joke, the wrapper says something nice.',
			price: 15,
			type: ItemType.CONSUMABLE,
		});
	}

	public async use(user: User) {
		await user.heal(15);
		return [
			"You're super spiffy!",
			'Are those claws natural?',
			'Love yourself! I love you!',
			'You look nice today!',
			'(An illustration of a hug)',
			'Have a wonderful day!',
			'Is this as sweet as you?',
			"You're just great!",
		].random();
	}
}

export default NiceCream;
