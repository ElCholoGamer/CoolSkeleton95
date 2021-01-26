import Category from '../../structures/category';
import Command from '../../structures/command';
import CommandEvent from '../../structures/command/command-event';

class Give extends Command {
	public constructor() {
		super('give', 'Gives money to the mentioned user', Category.OWNER, {
			usage: '[amount] [@User]',
		});
	}

	public async execute({ args, message, channel }: CommandEvent) {
		const amount = Number(args[0]);
		if (isNaN(amount)) return await channel.send('SPECIFY A VALID AMOUNT!!!');

		const target = message.mentions.users.first();
		if (!target) {
			return await channel.send('MENTION SOMEONE TO GIVE THE GOLD TO.');
		}

		await target.addGold(amount);
		await channel.send(
			`**${amount}G** GIVEN TO **${target.username.toUpperCase()}**!!!`
		);
	}
}

export default Give;
