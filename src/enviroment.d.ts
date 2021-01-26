import { IGuild } from './models/guild';
import { IUser } from './models/user';
import Shop from './rpg/shop';
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
		shop: Shop;
	}

	interface Guild {
		getDocument(): Promise<IGuild>;
	}

	interface User {
		inBattle: boolean;
		getDocument(): Promise<IUser>;
		heal(amount: number): Promise<IUser>;
		damage(amount: number): Promise<IUser>;

		getGold(): Promise<number>;
		addGold(amount: number): Promise<IUser>;

		addItem(id: number, amount?: number): Promise<IUser>;
		removeItem(id: number, amount?: number): Promise<IUser>;
	}
}
