import { MessageAttachment } from 'discord.js';
import { createCanvas, loadImage } from 'canvas';
import Category from '../../structures/category';
import Command from '../../structures/command';
import CommandEvent from '../../structures/command/command-event';

class Pixelate extends Command {
	public constructor() {
		super('pixelate', "PIXELATES A USER'S AVATAR.", Category.FUN);
	}

	public async execute({ author, message, channel, args }: CommandEvent) {
		const user = message.mentions.users.first() ?? author;
		const size = 512;

		const avatarSize = Math.clamp(Number(args[0]), 1, size) || 32;
		const avatarCanvas = createCanvas(avatarSize, avatarSize);
		const avatarCtx = avatarCanvas.getContext('2d');

		const avatarURL = user.displayAvatarURL({ format: 'png', size });
		const avatar = await loadImage(avatarURL);

		avatarCtx.drawImage(avatar, 0, 0, avatarSize, avatarSize);

		const canvas = createCanvas(size, size);
		const ctx = canvas.getContext('2d');

		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(avatarCanvas, 0, 0, size, size);

		const attachment = new MessageAttachment(canvas.toBuffer(), 'avatar.png');
		await channel.send(attachment);
	}
}

export default Pixelate;
