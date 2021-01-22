import { Client } from 'discord.js';
import startup from './startup';

const NODE_ENV = (process.env.NODE_ENV = process.argv.includes('-d')
	? 'development'
	: 'production');

console.log(`Running in ${NODE_ENV} mode`);

(async () => {
	if (NODE_ENV === 'development') (await import('dotenv')).config();

	const client = new Client();
	await startup(client);

	console.log('Logging in...');
	client.login(process.env.TOKEN);
})().catch(console.error);
