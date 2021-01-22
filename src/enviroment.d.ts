import CommandHandler from './structures/command/command-handler';

declare module 'discord.js' {
	interface Client {
		commandHandler: CommandHandler;
	}
}
