import { ActivityOptions } from 'discord.js';
import EventHandler from '../structures/event-handler';
import { activity } from '../config.json';

class ReadyHandler extends EventHandler('ready') {
	public async execute() {
		const { user } = this.client;
		if (!user) return;

		await this.setActivity();
		setInterval(() => this.setActivity(), 10 * 60 * 1000);

		console.log(`Logged in as "${this.client.user?.tag}"!`);
	}

	private setActivity() {
		return this.client.user?.setActivity(activity as ActivityOptions);
	}
}

export default ReadyHandler;
