import Category from '../../structures/category';
import Command from '../../structures/command';
import CommandEvent from '../../structures/command/command-event';
import DialogGenerator from '../../util/dialog-generator';

class Test extends Command {
	public constructor() {
		super('test', 'Owner command to test stuff', Category.OWNER);
	}

	public async execute({ channel, args }: CommandEvent) {
		const gen = await DialogGenerator.init();

		const embed = gen.embedDialog(args.join(' '));
		await channel.send(embed);
	}
}

export default Test;
