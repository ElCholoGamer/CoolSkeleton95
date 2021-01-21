import EventHandler from '../structures/event-handler';

class ReadyHandler extends EventHandler('ready') {
	public execute() {
		console.log(`Logged in as "${this.client.user?.tag}"!`);
	}
}

export default ReadyHandler;
