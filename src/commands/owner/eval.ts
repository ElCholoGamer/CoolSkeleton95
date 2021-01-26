import { MessageEmbed } from 'discord.js';
import Category from '../../structures/category';
import Command from '../../structures/command/command';
import CommandEvent from '../../structures/command/command-event';
import { prefix, embedColor } from '../../config.json';
import { inspect } from 'util';

class Eval extends Command {
	public constructor() {
		super('eval', 'Evaluates a JavaScript expression.', Category.OWNER);
	}

	public async execute({ args, channel, message }: CommandEvent) {
		if (!args.length) {
			return await channel.send('YOU GOTTA PROVIDE AN EXPRESSION!!!');
		}

		const toEval = message.content
			.slice(prefix.length)
			.replace(/^\s*eval/i, '')
			.trim();

		try {
			const result = eval(toEval);
			const formatted = inspect(result);

			await channel.send(
				new MessageEmbed()
					.setColor(embedColor)
					.setTitle('SUCCESS!!!')
					.setDescription(
						[
							'INPUT:',
							'```js',
							toEval,
							'```',
							'OUTPUT:',
							'```js',
							formatted,
							'```',
						].join('\n')
					)
			);
		} catch (err) {
			const formatted = inspect(err);

			await channel.send(
				new MessageEmbed()
					.setColor(embedColor)
					.setTitle('ERROR!!!')
					.setDescription(
						[
							'INPUT',
							'```js',
							toEval,
							'```',
							'STACK TRACE:',
							'```',
							formatted,
							'```',
						].join('\n')
					)
			);
		}
	}
}

export default Eval;
