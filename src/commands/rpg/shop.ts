import { MessageEmbed } from 'discord.js';
import Category from '../../structures/category';
import Command from '../../structures/command/command';
import CommandEvent from '../../structures/command/command-event';
import CommandHandler from '../../structures/command/command-handler';
import { embedColor } from '../../config.json';

class Shop extends Command {
	public constructor(handler: CommandHandler) {
		super('shop', 'SHOWS ALL AVAILABLE ITEMS.', Category.RPG, handler);
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
