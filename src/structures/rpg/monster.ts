/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Battle from './battle';

type Awaitable<T> = Promise<T> | T;

export interface MonsterOptions {
	name: string;
	description: string;
	fullHP: number;
	image?: string;
}

export interface ActOption {
	name: string;
	execute: (this: Monster, battle: Battle) => Awaitable<string>;
}

abstract class Monster {
	public readonly name: string;
	public readonly description: string;
	public readonly fullHP: number;
	public readonly image: string | null;
	public hp: number;

	protected _spareable = false;
	protected _fleeable = true;

	public constructor(options: MonsterOptions) {
		this.name = options.name;
		this.description = options.description;
		this.fullHP = options.fullHP;
		this.image = options.image ?? null;

		this.hp = this.fullHP;
	}

	public abstract getAttack(battle: Battle): Awaitable<number>;
	public abstract getDefense(battle: Battle): Awaitable<number>;
	public abstract getXP(battle: Battle): Awaitable<number>;
	public abstract getGold(spared: boolean, battle: Battle): Awaitable<number>;
	public abstract getActOptions(battle: Battle): Awaitable<ActOption[]>;
	public abstract getBattleDialog(battle: Battle): Awaitable<string>;

	public getAttackDialog(battle: Battle): Awaitable<string | undefined> {
		return undefined;
	}

	public onSpawn(battle: Battle): Awaitable<void> {}
	public onDamage(damage: number, battle: Battle): Awaitable<void> {}
	public onDeath(battle: Battle): Awaitable<void> {}
	public onSpare(battle: Battle): Awaitable<void> {}

	public get spareable() {
		return this._spareable;
	}

	public get fleeable() {
		return this._fleeable;
	}
}

export default Monster;
