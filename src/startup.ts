import { Client, ClientEvents } from 'discord.js';
import { readdir } from 'fs/promises';
import { join } from 'path';
import EventHandler from './structures/event-handler';
import { removeExtension } from './utils';

async function startup(client: Client) {
	// Events
	const eventFiles = (await readdir(join(__dirname, 'events'))).filter(file =>
		/\.(ts|js)$/i.test(file)
	);

	await Promise.all(
		eventFiles.map(async file => {
			const { default: Handler } = await import(
				join(__dirname, 'events', file)
			);
			if (typeof Handler !== 'function') return;

			const handler: EventHandler<keyof ClientEvents> = new Handler(client);
			client.on(handler.eventName, handler.execute.bind(handler));
		})
	);
}

export default startup;
