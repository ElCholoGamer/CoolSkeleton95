/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import BattleContext from './battle-context';
import MonsterOptions from './monster-options';

type Awaitable<T> = Promise<T> | T;

abstract class Monster {
	public readonly name: string;
	public readonly description: string;
	public readonly fullHP: number;
	public readonly image: string | null;
	public hp: number;

	public constructor(options: MonsterOptions) {
		this.name = options.name;
		this.description = options.description;
		this.fullHP = options.fullHP;
		this.image = options.image ?? null;

		this.hp = this.fullHP;
	}

	public abstract getAttack(ctx: BattleContext): Awaitable<number>;
	public abstract getDefense(ctx: BattleContext): Awaitable<number>;
	public abstract getXP(ctx: BattleContext): Awaitable<number>;
	public abstract getGold(ctx: BattleContext): Awaitable<number>;
	public abstract getActOptions(
		ctx: BattleContext
	): Awaitable<Record<string, () => void>>;

	public onAttack(dmg: number, ctx: BattleContext) {}
	public onDeath(ctx: BattleContext) {}
	public onSpare(ctx: BattleContext) {}
}

export class ExampleMonster extends Monster {
	public constructor() {
		super({
			name: 'example',
			description: 'An example monster',
			fullHP: 0,
		});
	}
	public getAttack() {
		return 0;
	}
	public getDefense() {
		return 0;
	}
	public getXP() {
		return 0;
	}
	public getGold() {
		return 0;
	}
	getActOptions() {
		return {};
	}
}

export default Monster;
