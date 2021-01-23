import { IUser } from './models/user';
import CommandHandler from './structures/command/command-handler';

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: 'development' | 'production';
		}
	}

	interface Math {
		clamp(num: number, min: number, max: number): number;
	}
}

declare module 'discord.js' {
	interface Client {
		commandHandler: CommandHandler;
	}

	interface User {
		getDocument(): Promise<IUser>;
	}
}
