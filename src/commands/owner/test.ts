import Category from '../../structures/category';
import Command from '../../structures/command/command';
import CommandEvent from '../../structures/command/command-event';
import CommandHandler from '../../structures/command/command-handler';
import DialogGenerator from '../../util/dialog-generator';

class Test extends Command {
	public constructor(handler: CommandHandler) {
		super('test', 'Owner command to test stuff', Category.OWNER, handler);
	}

	public async execute({ channel, args }: CommandEvent) {
		const gen = await DialogGenerator.init();

		const embed = gen.embedDialog(args.join(' '));
		await channel.send(embed);
	}
}

export default Test;
