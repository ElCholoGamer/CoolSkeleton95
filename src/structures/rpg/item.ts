import { User } from 'discord.js';
import { Awaitable } from '../../util/constants';
import Battle from './battle';

export interface ItemOptions {
	id: number;
	name: string;
	description: string;
	price: number;
	type: ItemType;
}

export enum ItemType {
	CONSUMABLE,
	WEAPON,
	ARMOR,
	MISCELLANEOUS,
}

abstract class Item {
	public readonly id: number;
	public readonly name: string;
	public readonly description: string;
	public readonly price: number;
	public readonly type: ItemType;

	protected constructor(options: ItemOptions) {
		this.name = options.name;
		this.description = options.description;
		this.price = options.price;
		this.id = options.id;
		this.type = options.type;
	}

	public onBuy(user: User, amount: number): Awaitable<string | undefined> {
		return `You bought ${this.name} x${amount}.`;
	}

	public abstract use(user: User, battle?: Battle): Awaitable<string>;
}

export default Item;
