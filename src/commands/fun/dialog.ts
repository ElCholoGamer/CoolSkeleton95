import { createCanvas, Image, loadImage } from 'canvas';
import { MessageEmbed, MessageAttachment } from 'discord.js';
import { readdir } from 'fs/promises';
import { join } from 'path';
import Category from '../../structures/category';
import Command from '../../structures/command/command';
import CommandEvent from '../../structures/command/command-event';
import CommandHandler from '../../structures/command/command-handler';
import { formatList, removeExtension } from '../../utils';
import { embedColor } from '../../config.json';

class Dialog extends Command {
	private bg: Image | null;
	private characters: Record<string, Record<string, Image>>;

	public constructor(handler: CommandHandler) {
		super(
			'dialog',
			'CREATES A COOL CHARACTER DIALOG BOX WITH THE GIVEN TEXT.',
			Category.FUN,
			handler,
			{
				selfPermissions: ['ATTACH_FILES'],
				exampleArgs: [
					"papyrus LOOK SANS, I'M ON DISCORD!!!",
					'sans_wink hey bud, want a hot dog?',
				],
			}
		);

		this.bg = null;
		this.characters = {};

		this.loadImages();
	}

	private async loadImages() {
		const assets = './assets/img/dialog';
		this.bg = await loadImage(join(assets, 'background.png'));

		const folders = (await readdir(assets)).filter(
			file => file.indexOf('.') === -1
		);

		await Promise.all(
			folders.map(async folder => {
				this.characters[folder] = {};
				const files = await readdir(join(assets, folder));

				await Promise.all(
					files.map(async file => {
						const image = await loadImage(join(assets, folder, file));
						this.characters[folder][removeExtension(file)] = image;
					})
				);
			})
		);

		return this;
	}

	public async execute({ channel, args }: CommandEvent) {
		if (!this.bg) return;
		if (!args.length) {
			return await channel.send(
				new MessageEmbed()
					.setColor(embedColor)
					.setDescription(
						[
							'YOU NEED TO SPECIFY ONE OF THESE CHARACTERS:',
							'',
							formatList(Object.keys(this.characters)),
						].join('\n')
					)
			);
		}

		const [character, ...rest] = args;
		const [name, mode = 'default'] = character.toLowerCase().split(/_(.+)/);

		if (!(name in this.characters)) {
			return await channel.send(
				new MessageEmbed()
					.setColor(embedColor)
					.setDescription(
						[
							"THAT CHARACTER DOESN'T EXIST! THESE ARE ALL MY AVAILABLE CHARACTERS:",
							'',
							formatList(Object.keys(this.characters)),
						].join('\n')
					)
			);
		}

		const modes = this.characters[name];

		if (!(mode in modes)) {
			return await channel.send(
				new MessageEmbed()
					.setColor(embedColor)
					.setDescription(
						[
							`THAT MODE DOESN'T EXIST! THESE ARE ALL THE MODES FOR ${name.toUpperCase()}:`,
							'',
							formatList(Object.keys(modes)),
						].join('\n')
					)
			);
		}

		if (args.length === 1) {
			return await channel.send('YOU GOTTA PASS SOME TEXT, TOO!!!');
		}

		const face = modes[mode];

		const { width, height } = this.bg;
		const canvas = createCanvas(width, height);
		const ctx = canvas.getContext('2d');

		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(this.bg, 0, 0, width, height);
		ctx.drawImage(face, 6, 6, 142, 142);

		// Font style
		ctx.textAlign = 'left';
		ctx.textBaseline = 'top';
		ctx.textDrawingMode = 'path';
		ctx.fillStyle = 'white';
		const fontSize = 32;

		// Select font family
		ctx.font = `${fontSize}px ${
			name === 'sans'
				? 'Comic Sans UT'
				: name === 'papyrus'
				? 'Papyrus UT'
				: 'Determination Mono'
		}`;

		const lines = rest.reduce<string[]>(
			(acc, word) => {
				const last = acc.length - 1;
				const { width } = ctx.measureText(acc[last]);

				if (width < 370) {
					if (acc[last] !== '') acc[last] += ' ';
					acc[last] += word;
				} else if (acc.length < 3) {
					acc.push(word);
				}

				return acc;
			},
			['']
		);

		// Draw text
		ctx.fillText('*', 142, 22);
		for (let i = 0; i < lines.length; i++) {
			ctx.fillText(lines[i], 172, 22 + i * (fontSize + 6));
		}

		const fileName = `${name}.png`;
		const attachment = new MessageAttachment(canvas.toBuffer(), fileName);
		await channel.send(attachment);
	}
}

export default Dialog;
