import { Schema, model, Document } from 'mongoose';

export interface IGuild extends Document {
	_id: string;
	rpgChannel?: string;
}

const GuildSchema = new Schema({
	_id: String,
	rpgChannel: String,
});

const Guild = model<IGuild>('Guild', GuildSchema);

export default Guild;
