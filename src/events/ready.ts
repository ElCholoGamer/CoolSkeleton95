import { Client } from 'discord.js';
import EventHandler from '../structures/event-handler';

class ReadyHandler extends EventHandler<'ready'> {
	public constructor(client: Client) {
		super('ready', client);
	}

	public execute() {
		console.log(`Logged in as "${this.client.user?.tag}"!`);
	}
}

export default ReadyHandler;
