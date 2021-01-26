import Category from '../../structures/category';
import Command from '../../structures/command';

class Buy extends Command {
	public constructor() {
		super('buy', 'BUYS AN ITEM FROM THE SHOP.', Category.RPG);
	}

	public async execute() {}
}

export default Buy;
