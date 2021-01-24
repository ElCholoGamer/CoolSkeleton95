import Category from '../../structures/category';
import Command from '../../structures/command/command';
import CommandEvent from '../../structures/command/command-event';
import CommandHandler from '../../structures/command/command-handler';

class Test extends Command {
	public constructor(handler: CommandHandler) {
		super('test', 'Owner command to test stuff', Category.OWNER, handler);
	}

	public async execute({ channel }: CommandEvent) {
		await channel.send("This command doesn't do anything yet lol");
	}
}

export default Test;
