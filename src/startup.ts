import { Client, ClientEvents } from 'discord.js';
import { join } from 'path';
import EventHandler, { BaseHandler } from './structures/event-handler';
import { readFullDir, removeExtension } from './utils';

async function startup(client: Client) {
	// Events
	const eventFiles = (
		await readFullDir(join(__dirname, 'events'))
	).filter(file => /\.(ts|js)$/i.test(file));

	await Promise.all(
		eventFiles.map(async file => {
			const { default: Handler } = await import(file);
			if (typeof Handler !== 'function') return;

			const handler: BaseHandler<any> = new Handler(client);
			client.on(handler.eventName, handler.execute.bind(handler));
		})
	);
}

export default startup;
