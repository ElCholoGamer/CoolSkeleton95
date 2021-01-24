import Category from '../../structures/category';
import Command from '../../structures/command/command';
import CommandEvent from '../../structures/command/command-event';
import CommandHandler from '../../structures/command/command-handler';

class SetChannel extends Command {
	public constructor(handler: CommandHandler) {
		super(
			'setchannel',
			'SETS THE RPG CHANNEL ON THIS SERVER.',
			Category.RPG,
			handler,
			{ permissions: ['ADMINISTRATOR'] }
		);
	}

	public async execute({ message, channel, guild }: CommandEvent) {
		const newChannel = message.mentions.channels.first();
		if (!newChannel) {
			return await channel.send('YOU NEED TO MENTION A SERVER CHANNEL!!!');
		}

		const doc = await guild.getDocument();
		doc.rpgChannel = newChannel.id;
		await doc.save();

		await channel.send(
			`RPG CHANNEL SET TO <#${doc.rpgChannel}> SUCCESSFULLY!!!`
		);
	}
}

export default SetChannel;
