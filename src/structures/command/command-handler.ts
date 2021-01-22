import { DMChannel } from 'discord.js';
import { Message } from 'discord.js';
import { Client, Collection } from 'discord.js';
import { join } from 'path';
import { readFullDir } from '../../utils';
import Command from './command';

class CommandHandler {
	public readonly commands: Collection<string, Command>;

	public constructor(public readonly client: Client) {
		this.commands = new Collection();
		client.on('message', m => this.handle(m));
	}

	public async init(): Promise<Collection<string, Command>> {
		const folder = join(__dirname, '../../commands');
		const files = (await readFullDir(folder)).filter(file =>
			/\.(ts|js)$/i.test(file)
		);

		await Promise.all(
			files.map(async file => {
				const { default: Command } = await import(file);
				if (typeof Command !== 'function') return;

				const command: Command = new Command(this);
				this.commands.set(command.name, command);
			})
		);

		console.log('Commands:', this.commands);
		return this.commands;
	}

	public findCommand(search = ''): Command | undefined {
		search = search?.toLowerCase();
		if (this.commands.has(search)) return this.commands.get(search);

		return this.commands.find(
			cmd =>
				!!cmd.options.aliases?.some(alias => alias.toLowerCase() === search)
		);
	}

	public async handle(message: Message) {}
}

export default CommandHandler;
