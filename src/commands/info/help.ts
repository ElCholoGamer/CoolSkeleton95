import { MessageEmbed, EmbedField } from 'discord.js';
import Category from '../../structures/category';
import Command from '../../structures/command/command';
import CommandEvent from '../../structures/command/command-event';
import CommandHandler from '../../structures/command/command-handler';
import { prefix, embedColor } from '../../config.json';
import { formatPermissions } from '../../utils';

export default class Help extends Command {
	public constructor(handler: CommandHandler) {
		super(
			'help',
			'SHOWS THE LIST OF MY AWESOME COMMANDS.',
			Category.INFO,
			handler,
			{ usage: '(command)' }
		);
	}

	public async execute({ channel, client, args: [search] }: CommandEvent) {
		const embed = new MessageEmbed().setColor(embedColor);

		if (!search) {
			embed
				.setTitle("COOLSKELETON95'S TOTALLY COOL COMMANDS")
				.setThumbnail(
					client.user!.displayAvatarURL({ format: 'png', size: 256 })
				);

			const categories: Category[] = Object.values(Category).filter(
				category => category.showHelp
			);

			const fields = categories.map<EmbedField>(category => {
				const commands = this.commandHandler.commands.filter(
					cmd => cmd.category === category
				);

				const list = commands.map(cmd => {
					let inner = cmd.name;

					const { aliases } = cmd.options;
					if (aliases?.length) inner += ` (${aliases.join(', ')})`;

					return `\`${inner}\``;
				});

				return {
					name: category.displayName,
					value: list.join(', ') || '[No commands]',
					inline: false,
				};
			});

			embed.addFields(fields);
		} else {
			const command = client.commandHandler.findCommand(search);
			if (!command) return await channel.send("THAT COMMAND DOESN'T EXIST!");

			const {
				name,
				description,
				options: { aliases, permissions, usage = '', exampleArgs },
			} = command;

			embed
				.setTitle(`${name.toUpperCase()} COMMAND`)
				.setDescription(description)
				.addField('USAGE:', `\`${(prefix + name + ' ' + usage).trim()}\``);

			if (aliases?.length) {
				embed.addField(
					'ALIASES:',
					aliases.map(alias => `\`${alias}\``).join(', ')
				);
			}

			if (permissions?.length) {
				embed.addField('PERMISSIONS:', formatPermissions(permissions));
			}

			if (exampleArgs?.length) {
				embed.addField(
					'EXAMPLES:',
					exampleArgs.map(args => `\`${prefix}${name} ${args}\``).join('\n')
				);
			}
		}

		await channel.send(embed);
	}
}
