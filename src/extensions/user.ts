import { User } from 'discord.js';
import UserModel from '../models/user';

User.prototype.getDocument = async function () {
	const found = await UserModel.findById(this.id);
	return found ?? new UserModel({ _id: this.id });
};

User.prototype.addGold = async function (amount) {
	const doc = await this.getDocument();
	if (doc.isNew) await doc.save();

	await UserModel.findByIdAndUpdate(this.id, { $inc: { gold: amount } });
};
