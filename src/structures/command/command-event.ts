import {
	Client,
	DMChannel,
	Guild,
	GuildMember,
	Message,
	NewsChannel,
	TextChannel,
	User,
} from 'discord.js';

class CommandEvent {
	public readonly author: User;
	public readonly member: GuildMember;
	public readonly guild: Guild;
	public readonly channel: TextChannel | NewsChannel;
	public readonly client: Client;

	public constructor(public readonly message: Message, public args: string[]) {
		if (!message.member) throw new TypeError('Message must have a member');
		if (!message.guild) throw new TypeError('Message must have a guild');
		if (message.channel instanceof DMChannel)
			throw new TypeError("Message channel can't be an instance of DMChannel");

		this.author = message.author;
		this.member = message.member;
		this.guild = message.guild;
		this.client = message.client;
		this.channel = message.channel;
	}
}

export default CommandEvent;
