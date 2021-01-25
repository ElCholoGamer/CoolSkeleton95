import { User } from 'discord.js';
import UserModel from '../models/user';

User.prototype.inBattle = false;

User.prototype.getDocument = async function () {
	const found = await UserModel.findById(this.id);
	return found ?? new UserModel({ _id: this.id });
};

User.prototype.addGold = async function (amount) {
	const doc = await this.getDocument();
	doc.gold = Math.max(doc.gold + amount, 0);
	return doc.save();
};
