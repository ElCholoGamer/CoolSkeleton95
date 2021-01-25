import Category from '../../../structures/category';
import Command from '../../../structures/command/command';
import CommandEvent from '../../../structures/command/command-event';
import CommandHandler from '../../../structures/command/command-handler';
import puns from './puns.json';

class Pun extends Command {
	public constructor(handler: CommandHandler) {
		super(
			'pun',
			"DONT'T BLAME ME, SANS TOLD ME TO MAKE THIS COMMAND. SERIOUSLY, THESE PUNS ARE REALLY BAD!!!",
			Category.FUN,
			handler
		);
	}

	public async execute({ channel }: CommandEvent) {
		const pun = puns.random();
		const text = typeof pun === 'string' ? pun : pun.join('\n');
		await channel.send(`"${text}"`);
	}
}

export default Pun;
