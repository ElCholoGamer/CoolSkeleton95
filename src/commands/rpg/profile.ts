import { MessageAttachment } from 'discord.js';
import { Canvas, createCanvas, Image, loadImage } from 'canvas';
import Category from '../../structures/category';
import Command from '../../structures/command';
import CommandEvent from '../../structures/command/command-event';

class Profile extends Command {
	public constructor() {
		super('profile', 'SHOWS YOUR PROFILE.', Category.RPG);
	}

	private grayscale(image: Image): Canvas {
		const { width, height } = image;
		const canvas = createCanvas(width, height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(image, 0, 0, width, height);

		const imageData = ctx.getImageData(0, 0, width, height);
		const { data } = imageData;

		const chunks = Array.prototype.chunk.call(data, 4);
		for (let i = 0; i < chunks.length; i++) {
			const [r, g, b, a] = chunks[i];
			const avg = ((r + g + b) / 3) * (a / 255);

			data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = avg;
			data[i * 4 + 3] = 255;
		}

		ctx.putImageData(imageData, 0, 0);
		return canvas;
	}

	public async execute({ channel, author, message }: CommandEvent) {
		const user = message.mentions.users.filter(u => !u.bot).first() ?? author;

		const { hp, gold } = await user.getDocument();

		const [width, height] = [800, 270];
		const canvas = createCanvas(width, height);
		const ctx = canvas.getContext('2d');

		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, width, height);

		ctx.lineWidth = 18;
		ctx.strokeStyle = 'white';
		ctx.strokeRect(0, 0, width, height);

		const avatarURL = user.displayAvatarURL({ format: 'png', size: 256 });
		const avatar = this.grayscale(await loadImage(avatarURL));

		// Avatar
		const avatarSize = 160;
		const [avatarX, avatarY] = [55, height / 2 - avatarSize / 2];

		ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
		ctx.lineWidth = 5;
		ctx.strokeRect(avatarX, avatarY, avatarSize, avatarSize);

		// Username
		ctx.fillStyle = 'white';
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'left';

		let fontSize = 53;
		do {
			ctx.font = `${(fontSize -= 5)}px Determination Mono`;
		} while (ctx.measureText(user.tag).width > 460);

		ctx.fillText(user.tag, 250, 81);

		// Gold
		ctx.textAlign = 'right';
		ctx.font = '38px Determination Mono';
		ctx.fillText(`${gold}G`, width - 50, 195);

		// HP bar
		const percentage = hp / 20;
		const fullWidth = 80;
		const [x, y, barHeight] = [305, 175, 45];

		ctx.fillStyle = 'red';
		ctx.fillRect(x, y, fullWidth, barHeight);

		ctx.fillStyle = 'yellow';
		ctx.fillRect(x, y, fullWidth * percentage, barHeight);

		// HP text
		ctx.fillStyle = 'white';
		ctx.textAlign = 'left';
		ctx.font = '16px UT HP';
		ctx.fillText(`${hp}/20`, x + fullWidth + 15, y + barHeight / 2);

		ctx.textAlign = 'right';
		ctx.fillText('HP', x - 12, y + barHeight / 2);

		const attachment = new MessageAttachment(canvas.toBuffer(), 'profile.png');
		await channel.send(attachment);
	}
}

export default Profile;
