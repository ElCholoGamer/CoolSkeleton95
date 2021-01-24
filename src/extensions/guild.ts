import { Guild } from 'discord.js';
import GuildModel from '../models/guild';

Guild.prototype.getDocument = async function () {
	const doc = await GuildModel.findById(this.id);
	return doc ?? new GuildModel({ _id: this.id });
};
