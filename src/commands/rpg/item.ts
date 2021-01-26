import { MessageEmbed } from 'discord.js';
import Category from '../../structures/category';
import Command from '../../structures/command';
import CommandEvent from '../../structures/command/command-event';
import { embedColor } from '../../config.json';

class Item extends Command {
	public constructor() {
		super('item', 'SHOWS INFO ABOUT AN ITEM.', Category.RPG);
	}

	public async execute({ channel, args, client }: CommandEvent) {
		if (!args.length) {
			return await channel.send('COME ON, SPECIFY AN ITEM FIRST!!!');
		}

		const item = client.shop.findItem(args.join(' '));
		if (!item) return await channel.send("I CAN'T FIND THAT ITEM ANYWHERE!!!");

		const { name, description, price, id } = item;
		await channel.send(
			new MessageEmbed()
				.setColor(embedColor)
				.setTitle(name)
				.setDescription(`"${description}"`)
				.addFields(
					{ name: 'Item ID:', value: `\`${id}\`` },
					{ name: 'Price:', value: `${price}G` }
				)
		);
	}
}

export default Item;
