import { User } from 'discord.js';
import UserModel from '../models/user';

User.prototype.getDocument = async function () {
	const found = await UserModel.findById(this.id);
	return found ?? new UserModel({ _id: this.id });
};
