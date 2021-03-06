import { Client } from 'discord.js';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import startup from './util/startup';
import db from './util/db';
import Shop from './rpg/shop';
import { join } from 'path';
import { readFullDir } from './util/utils';

const NODE_ENV = (process.env.NODE_ENV ||= process.argv.includes('-d')
	? 'development'
	: 'production');

(async () => {
	if (NODE_ENV === 'development') (await import('dotenv')).config();

	if (existsSync('ascii.txt')) {
		const ascii = (await readFile('ascii.txt')).toString();
		console.log(ascii);
	}

	// Extensions
	const extensionFiles = await readFullDir(join(__dirname, 'extensions'));
	await Promise.all(extensionFiles.map(file => import(file)));

	console.log(`Running in ${NODE_ENV} mode`);

	await db();
	console.log('MongoDB connected!');

	const client = new Client({ restTimeOffset: 300 });
	client.shop = await Shop.init();
	await startup(client);

	console.log('Logging in...');
	client.login(process.env.TOKEN);
})().catch(console.error);
