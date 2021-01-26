import { User } from 'discord.js';

export interface ItemOptions {
	id: number;
	name: string;
	description: string;
	price: number;
}

abstract class Item {
	public readonly id: number;
	public readonly name: string;
	public readonly description: string;
	public readonly price: number;

	protected constructor(options: ItemOptions) {
		this.name = options.name;
		this.description = options.description;
		this.price = options.price;
		this.id = options.id;
	}

	public async onBuy(user: User, amount: number): Promise<string | undefined> {
		return `You bought ${this.name} x${amount}.`;
	}

	public abstract use(user: User): Promise<string>;
}

export default Item;
