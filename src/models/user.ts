import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
	_id: string;
	gold: number;
	hp: number;
}

const UserSchema = new Schema({
	_id: String,
	gold: { type: Number, required: true, min: 0, default: 0 },
	hp: { type: Number, required: true, min: 0, max: 20, default: 20 },
});

const User = model<IUser>('User', UserSchema);

export default User;
