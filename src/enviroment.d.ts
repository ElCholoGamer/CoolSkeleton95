import { IGuild } from './models/guild';
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
		randomInt(min: number, max: number): number;
	}

	interface Array<T> {
		random(): T;
	}
}

declare module 'discord.js' {
	interface Client {
		commandHandler: CommandHandler;
	}

	interface Guild {
		getDocument(): Promise<IGuild>;
	}

	interface User {
		inBattle: boolean;
		getDocument(): Promise<IUser>;
		addGold(amount: number): Promise<void>;
	}
}
