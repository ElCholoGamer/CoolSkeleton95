import { Client } from 'discord.js';
import startup from './util/startup';
import db from './util/db';

const NODE_ENV = (process.env.NODE_ENV = process.argv.includes('-d')
	? 'development'
	: 'production');

console.log(`Running in ${NODE_ENV} mode`);

(async () => {
	if (NODE_ENV === 'development') (await import('dotenv')).config();

	console.log('Connecting to database...');
	await db();

	const client = new Client({ restTimeOffset: 300 });
	await startup(client);

	console.log('Logging in...');
	client.login(process.env.TOKEN);
})().catch(console.error);
