import Category from '../../structures/category';
import Command from '../../structures/command';
import CommandEvent from '../../structures/command/command-event';

class Buy extends Command {
	public constructor() {
		super('buy', 'BUYS AN ITEM FROM THE SHOP.', Category.RPG);
	}

	public async execute({ args, channel, client, author }: CommandEvent) {
		if (!args.length) return await channel.send('SPECIFY AN ITEM!!!');

		let amount = Number(args[args.length - 1]);
		if (!isNaN(amount) && amount > 0) {
			args.pop();
		} else {
			amount = 1;
		}

		const item = client.shop.findItem(args.join(' '));
		if (!item) return await channel.send("I CAN'T SEEM TO FIND THAT ITEM.");

		const { name, price, id } = item;

		const finalPrice = price * amount;
		const gold = await author.getGold();

		if (gold < finalPrice) {
			return await channel.send("SORRY, HUMAN. YOU DON'T HAVE ENOUGH GOLD!!!");
		}

		await author.addGold(-finalPrice);
		await author.addItem(id);

		await channel.send(`YOU HAVE BOUGHT: **${name}** X${amount}`);
	}
}

export default Buy;
