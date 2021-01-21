import { Client, ClientEvents } from 'discord.js';

export abstract class BaseHandler<E extends keyof ClientEvents> {
	protected constructor(
		public readonly eventName: E,
		public readonly client: Client
	) {}

	public abstract execute(...args: ClientEvents[E]): void;
}

function EventHandler<E extends keyof ClientEvents>(eventName: E) {
	abstract class EventHandler extends BaseHandler<E> {
		protected constructor(client: Client) {
			super(eventName, client);
		}
	}

	return EventHandler;
}

export default EventHandler;
