import { Client, ClientEvents } from 'discord.js';

abstract class EventHandler<E extends keyof ClientEvents> {
	protected constructor(
		public readonly eventName: E,
		public readonly client: Client
	) {}

	public abstract execute(...args: ClientEvents[E]): void;
}

export default EventHandler;
