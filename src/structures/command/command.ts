import Category from '../category';
import CommandEvent from './command-event';
import CommandOptions from './command-options';

abstract class Command {
	protected constructor(
		public readonly name: string,
		public readonly description: string,
		public readonly category: Category,
		public readonly options: Readonly<CommandOptions> = {}
	) {}

	abstract execute(e: CommandEvent): Promise<any>;
}

export default Command;
