import { PermissionResolvable } from 'discord.js';
import Category from '../category';
import CommandEvent from './command-event';

export interface CommandOptions {
	aliases?: string[];
	usage?: string;
	permissions?: PermissionResolvable[];
	selfPermissions?: PermissionResolvable[];
	exampleArgs?: string[];
	disabled?: boolean;
}

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
