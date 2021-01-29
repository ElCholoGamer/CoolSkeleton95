import axios from 'axios';
import { MessageEmbed } from 'discord.js';
import Category from '../../structures/category';
import Command from '../../structures/command';
import CommandEvent from '../../structures/command/command-event';
import { embedColor } from '../../config.json';

class Reddit extends Command {
	public constructor() {
		super('reddit', 'GETS A POST FROM A SUBREDDIT.', Category.FUN);
	}

	public async execute({ channel, args }: CommandEvent) {
		if (!args.length) {
			return await channel.send('WHOOPS, YOU FORGOT TO MENTION A SUBREDDIT!!!');
		}

		const regex = /^(?:r\/?)?([a-z0-9_]{3,21})$/i;
		const subreddit = args[0].match(regex)?.[1];

		if (!subreddit) {
			return await channel.send('YOU SPECIFIED AN INVALID SUBREDDIT!!!');
		}

		const res = await axios
			.get(`https://www.reddit.com/r/${subreddit}/random.json`)
			.catch(() => null);

		if (!res) return await channel.send('WHOOPS, SOMETHING WENT WRONG.');

		const {
			title,
			post_hint,
			url,
			selftext,
			ups,
			author,
			permalink,
		} = res.data[0].data.children[0].data;

		const embed = new MessageEmbed()
			.setColor(embedColor)
			.setTitle(title)
			.setURL(`https://reddit.com${permalink}`)
			.setDescription(selftext.substr(0, 1800))
			.setFooter(`${ups} UPVOTES - BY u/${author}`);

		if (post_hint === 'image') embed.setImage(url);

		await channel.send(embed);
	}
}

export default Reddit;
