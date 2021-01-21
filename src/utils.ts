import { readdir, stat } from 'fs/promises';
import { resolve } from 'path';

export const removeExtension = (file: string) => file.replace(/\.[^.]*$/, '');

export async function readFullDir(dir: string): Promise<string[]> {
	const result: string[] = [];
	const list = await readdir(dir);

	for (const file of list) {
		const path = resolve(dir, file);
		const fileStat = await stat(path);

		if (fileStat.isDirectory()) {
			const subFiles = await readFullDir(path);
			result.push(...subFiles);
		} else {
			result.push(path);
		}
	}

	return result;
}
