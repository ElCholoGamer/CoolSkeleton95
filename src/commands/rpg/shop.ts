import { MessageEmbed } from 'discord.js';
import Category from '../../structures/category';
import Command from '../../structures/command/command';
import CommandEvent from '../../structures/command/command-event';
import { embedColor } from '../../config.json';

class Shop extends Command {
	public constructor() {
		super('shop', 'SHOWS ALL AVAILABLE ITEMS.', Category.RPG);
	}

	public async execute({ channel, client }: CommandEvent) {
		const lines = client.shop.items.map(
			item => `**${item.name}** - ${item.price}G`
		);

		await channel.send(
			new MessageEmbed()
				.setColor(embedColor)
				.setTitle('The Shop')
				.setDescription(lines.join('\n'))
		);
	}
}

export default Shop;
