import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
	_id: string;
	gold: number;
}

const UserSchema = new Schema({
	_id: String,
	gold: { type: Number, required: true, min: 0, default: 0 },
});

const User = model<IUser>('User', UserSchema);

export default User;
