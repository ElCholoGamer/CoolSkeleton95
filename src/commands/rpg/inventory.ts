import { MessageEmbed } from 'discord.js';
import Category from '../../structures/category';
import Command from '../../structures/command/command';
import CommandEvent from '../../structures/command/command-event';
import CommandHandler from '../../structures/command/command-handler';
import { embedColor } from '../../config.json';

class Inventory extends Command {
	public constructor(handler: CommandHandler) {
		super('inventory', 'SHOWS YOUR INVENTORY, DUH.', Category.RPG, handler, {
			aliases: ['inv'],
		});
	}

	public async execute({ channel, author, client, message }: CommandEvent) {
		const user = message.mentions.users.filter(u => !u.bot).first() ?? author;

		const doc = await user.getDocument();
		const items = Array.from(doc.items.entries());

		const lines = items.map(([id, amount]) => {
			const item = client.shop.findItem(id);
			return `**${item?.name || '[Unknown Item]'}** x${amount}`;
		});

		const displayUser = user.id === author.id ? 'Your' : `${user.username}'s`;
		await channel.send(
			new MessageEmbed()
				.setColor(embedColor)
				.setAuthor(
					`${displayUser} inventory`,
					user.displayAvatarURL({ dynamic: true, size: 256 })
				)
				.setDescription(
					lines.length ? lines.join('\n') : "[It's empty in here...]"
				)
		);
	}
}

export default Inventory;
