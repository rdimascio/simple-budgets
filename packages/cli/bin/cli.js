#!/usr/bin/env node

import { readdirSync } from 'fs';
import meow from 'meow';
import minimist from 'minimist';

import main from '../lib/main.js';
import { helpMessage } from '../utils/index.js';

const { _: [command, entity] } = minimist(process.argv.slice(2));

// const supportedCommands = readdirSync('./lib')
//     .map((file) => file.replace('.js', ''))
//     .filter((file) => file !== 'main');
const supportedCommands = [
	'add',
	'import',
	'config',
];

const supportedFlags = {
	add: {
		name: {
			type: 'string',
			alias: 'n',
		},
		...(entity === 'expense' || entity === 'income' ? {
			amount: {
				type: 'string',
				alias: 'a',
			},
			category: {
				type: 'string',
				alias: 'c',
			},
			date: {
				type: 'string',
				alias: 'd',
				default: new Date().toLocaleDateString(),
			},
			recurring: {
				type: 'boolean',
				alias: 'r',
			},
		} : {}),
		...(entity === 'category' ? {
			limit: {
				type: 'string',
				alias: 'l',
			},
		} : {}),
	},
	import: {
		file: {
			type: 'string',
			alias: 'f',
		},
	},
};

if (supportedCommands.includes(command)) {
	const {flags} = meow(helpMessage, {
		importMeta: import.meta,
		booleanDefault: undefined,
		allowUnknownFlags: false,
		flags: supportedFlags[command],
	});

	main(command, entity, flags);
} else {
	console.log(helpMessage);
	process.exit(0);
}
