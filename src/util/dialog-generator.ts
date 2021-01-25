import { MessageEmbed, MessageAttachment } from 'discord.js';
import { createCanvas, Image, loadImage } from 'canvas';
import { embedColor } from '../config.json';

class DialogGenerator {
	private cache: Record<string, Buffer> = {};

	private constructor(private readonly background: Image) {}

	public static async init() {
		const background = await loadImage('./assets/img/dialog/background.png');
		return new this(background);
	}

	public generate(text: string): Buffer {
		if (text in this.cache) return this.cache[text];

		const { width, height } = this.background;
		const canvas = createCanvas(width, height);
		const ctx = canvas.getContext('2d');

		ctx.imageSmoothingEnabled = false;

		ctx.drawImage(this.background, 0, 0, width, height);

		// Font style
		ctx.textAlign = 'left';
		ctx.textBaseline = 'top';
		ctx.textDrawingMode = 'path';
		ctx.fillStyle = 'white';

		const fontSize = 32;
		ctx.font = `${fontSize}px Determination Mono`;

		const lines = text.split(' ').reduce<string[]>(
			(acc, word) => {
				let newLines: string[] = [];
				if (word.indexOf('\n') !== -1) {
					[word, ...newLines] = word.split('\n');
				}

				const last = acc.length - 1;
				const next = (acc[last] + ' ' + word).trim();
				const { width } = ctx.measureText(next);

				if (width < 470) {
					acc[last] = next;
					newLines.forEach(word => acc.push(word));
				} else if (acc.length < 3) {
					acc.push(word);
				}

				return acc;
			},
			['']
		);

		ctx.fillText('*', 25, 22);
		for (let i = 0; i < lines.length; i++) {
			ctx.fillText(lines[i], 55, 22 + i * (fontSize + 6));
		}

		const buf = canvas.toBuffer();
		this.cache[text] = buf;
		return buf;
	}

	public embedDialog(
		dialog: string,
		monsterImage?: string | null
	): MessageEmbed {
		const image = this.generate(dialog);

		const attachment = new MessageAttachment(image, 'dialog.png');
		const embed = new MessageEmbed()
			.setColor(embedColor)
			.attachFiles([attachment])
			.setImage('attachment://dialog.png');

		if (monsterImage) {
			const attachment = new MessageAttachment(
				`./assets/img/monsters/${monsterImage}`,
				monsterImage
			);
			embed
				.attachFiles([attachment])
				.setThumbnail(`attachment://${monsterImage}`);
		}

		return embed;
	}
}

export default DialogGenerator;
