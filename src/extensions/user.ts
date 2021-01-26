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

User.prototype.heal = async function (amount) {
	const doc = await this.getDocument();
	doc.hp = Math.clamp(doc.hp + amount, 0, 20);
	return doc.save();
};

User.prototype.damage = function (amount) {
	return this.heal(-amount);
};

User.prototype.addItem = async function (id, amount = 1) {
	const stringID = id.toString();
	const doc = await this.getDocument();

	let newAmount = doc.items.get(stringID) ?? 0;
	newAmount = Math.max(newAmount + amount, 0);

	if (newAmount <= 0) {
		doc.items.delete(stringID);
	} else {
		doc.items.set(stringID, newAmount);
	}
	return doc.save();
};

User.prototype.removeItem = function (id, amount = 1) {
	return this.addItem(id, -amount);
};
