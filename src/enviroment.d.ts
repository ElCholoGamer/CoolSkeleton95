import CommandHandler from './structures/command/command-handler';

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: 'development' | 'production';
		}
	}
}

declare module 'discord.js' {
	interface Client {
		commandHandler: CommandHandler;
	}
}
