import { PermissionResolvable } from 'discord.js';

interface CommandOptions {
	aliases?: string[];
	usage?: string;
	permissions?: PermissionResolvable[];
	selfPermissions?: PermissionResolvable[];
	exampleArgs?: string[];
}

export default CommandOptions;
