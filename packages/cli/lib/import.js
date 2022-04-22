import chalk from 'chalk';
import { existsSync, readFileSync } from 'fs';
import inquirer from 'inquirer';
import os from 'os';
import path from 'path';

import {
	getAccounts,
	createTransaction,
	getAccount,
} from '../../db/index.js';
import { csvToJson, isValidCsv, isValidDate } from '../../utils/index.js';

const TRANSACTION_KEY_DICTIONARY = {
	'Transaction Date': 'date',
	'Post Date': 'date',
	'Description': 'name',
	'Amount': 'amount',
	'Category': 'category',
};

export default async (entity, args) => {
    const { file } = args;

	const filePath = path.join(os.homedir(), file.replace('~', ''));

	if (!existsSync(filePath)) {
		console.log(chalk.bold.red('File does not exist'));
		process.exit(0);
	}

	const supportedEntities = [ 'expenses', 'income' ];

	if (entity && !supportedEntities.includes(entity)) {
		console.log(`Processing entire contents of file. Expected one of ${supportedEntities.join(', ')}. Received ${entity}`);
	}

	const fileContents = readFileSync(filePath, 'utf8');
	if (!isValidCsv(fileContents)) {
		console.log(chalk.bold.red('Did not receive a valid CSV file'));
	}

	const transactions = csvToJson(fileContents)
		.map((transaction) => {
			return Object.keys(transaction).reduce((obj, key) => {
				if (TRANSACTION_KEY_DICTIONARY[key]) {
					obj[TRANSACTION_KEY_DICTIONARY[key]] = transaction[key];
				}

				return obj;
			}, {});
		})
		.filter(({amount, date, name}) => name && isValidDate(date) && !Number.isNaN(amount));

	if (!transactions.length) {
		console.log('No transactions found');
		process.exit(0);
	}

	const accounts = await getAccounts();
	const accountNames = accounts.map((account) => account.name);

	inquirer
		.prompt([
			{
				type: 'list',
				name: 'account',
				message: 'Which account was used for these transactions?',
				choices: [
					...(
						accounts.length
							? accountNames
							: []
					),
					'Create new account'
				],
			},
			{
				type: 'input',
				name: 'newAccount',
				message: 'Enter a unique name for the account.',
				when: (answers) => answers.account === 'Create new account',
				validate: (value) => {
					if (!accountNames.includes(value)) {
						return true;
					}
	
					return `Please enter a unique account name. "${value}" already exists.`
				},
			},
		])
		.then(async (answers) => {
			const {
				account,
				newAccount,
			} = answers;
			const { length } = transactions;
			const errors = [];

			for (let i = 0; i < length; i++) {
				const {
					amount,
					date,
					category,
					name,
				} = transactions[i];

				await createTransaction({
					name,
					amount: Number(amount),
					date: new Date(date),
					account: {
						...(newAccount ? {
							create: {
								name: newAccount,
							},
						} : {
							connect: {
								id: (await getAccount(account)).id
							},
						}),
					},
					category: {
						connectOrCreate: {
							where: {
								name: category,
							},
							create: {
								name: category,
							},
						},
					},
				})
					.catch((error) => {
						errors.push({
							transaction: transactions[i],
							message: error,
						});
					});

				if (i + 1 === length) {
					console.log(chalk.bold.green(`🎉 ${transactions.length - errors.length} new transactions created`));

					if (errors.length) {
						console.log(`${errors.length} errors encountered`);
						console.log(errors);
					}
				}
			}
		});
};
