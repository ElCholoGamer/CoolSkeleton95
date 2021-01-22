import EventHandler from '../structures/event-handler';

class ReadyHandler extends EventHandler('ready') {
	public async execute() {
		await Promise.all(
			this.client.guilds.cache.map(guild =>
				guild.me?.voice.connection?.disconnect()
			)
		);

		console.log(`Logged in as "${this.client.user?.tag}"!`);
	}
}

export default ReadyHandler;
