import chalk from 'chalk';
import inquirer from 'inquirer';

import {
	getAccounts,
	getCategories,
	createAccount,
	createCategory,
	createTransaction,
	getCategory,
	getAccount,
} from '../../db/index.js';
import {
	helpMessage,
	isNumber,
	isValidDate,
	isValidDateFormat,
	toNumber,
} from '../utils/index.js';

const supportedEntities = [
	'expense',
	'income',
	'category',
];

export default async (entity, args) => {
	const {
		amount,
		category,
		date,
		name,
		limit,
		recurring,
	} = args;

	const isEntityValid = entity && supportedEntities.includes(entity);

	if (entity && !isEntityValid) {
		console.log(helpMessage);
		process.exit(0);
	}

	const categories = await getCategories();
	const categoryNames = categories.map((category) => category.name);

	// Creating a new category, check if we have all flags
	if (entity === 'category' && name && limit) {
		if (!categoryNames.includes(name)) {
			try {
				await createCategory({ name, limit: toNumber(limit) });
				console.log(chalk.bold('🎉 New category created'));
			} catch (error) {
				console.log(chalk.bold.red('🚨 Error creating category:'));
				console.log(error);
			}
		} else {
			console.log(chalk.bold.red(`Category "${name}" already exists.`));
		}

		process.exit(0);
	}

	const accounts = await getAccounts();
	const accountNames = accounts.map((account) => account.name);

	const questions = [
		{
			type: 'list',
			name: 'type',
			message: 'What would you like to create?',
			choices: ['Expense', 'Income', 'Category'],
			filter: (val) => val.toLowerCase(),
			when: () => !isEntityValid,
		},
		{
			type: 'list',
			name: 'account',
			message: 'Which account was used for this transaction?',
			choices: [
				...(
					accounts.length
						? accountNames
						: []
				),
				'Create new account'
			],
			when: (answers) => entity !== 'category' && answers.type !== 'category',
		},
		{
			type: 'input',
			name: 'newAccount',
			message: 'Enter a unique name for the account.',
			when: (answers) => entity !== 'category' && answers.type !== 'category' && answers.account === 'Create new account',
			validate: (value) => {
				if (!accountNames.includes(value)) {
					return true;
				}

				return `Please enter a unique account name. "${value}" already exists.`
			},
		},
		{
			type: 'input',
			name: 'amount',
			message: 'What is the amount of the transaction?',
			when: (answers) => !amount && entity !== 'category' && answers.type !== 'category',
			validate: (value) => {
				return isNumber(value) || 'Please enter a number';
			},
		},
		{
			type: 'input',
			name: 'name',
			message: (answers) => `Enter a name for the ${entity || answers.type}`,
			when: (answers) => !amount && entity !== 'category' && answers.type !== 'category',
		},
		{
			type: 'input',
			name: 'date',
			message: 'When was the transaction?',
			when: (answers) => !date && entity !== 'category' && answers.type !== 'category',
			validate: (value) => {
				return isValidDate(value) && isValidDateFormat(value);
			},
		},
		{
			type: 'list',
			name: 'category',
			message: 'How would you like to categorize the transaction?',
			choices: [
				...(
					categories.length
						? categoryNames
						: []
				),
				'Create new category'
			],
			when: (answers) => (!category || (category && !categoryNames.includes(category))) && entity !== 'category' && answers.type !== 'category',
		},
		{
			type: 'input',
			name: 'newCategory',
			message: 'Enter a unique name for the category.',
			when: (answers) => entity === 'category' || answers.type === 'category' || answers.category === 'Create new category',
			validate: (value) => {
				if (!categoryNames.includes(value)) {
					return true;
				}

				return `Please enter a unique category name. "${value}" already exists.`
			},
		},
		{
			type: 'input',
			name: 'limit',
			message: 'Enter a spending limit for the category.',
			when: (answers) => entity === 'category' || answers.type === 'category' || answers.category === 'Create new category',
			validate: (value) => {
				return isNumber(value) || 'Please enter a number';
			},
		},
		{
			type: 'confirm',
			name: 'recurring',
			message: 'Is this a recurring transaction?',
			default: false,
			when: (answers) => !recurring && entity !== 'category' && answers.type !== 'category',
		},
	];

	inquirer
		.prompt(questions)
		.then(async (answers) => {
			const config = {...args, ...answers};
			const {
				newAccount,
				newCategory,
				amount,
				account,
				category,
				date,
				name,
				limit,
				recurring,
				type,
			} = config;

			if (entity === 'category' || type === 'category') {
				try {
					await createCategory({ name: newCategory, limit: toNumber(limit) });
					console.log(chalk.bold('🎉 New category created'));
				} catch (error) {
					console.log(chalk.bold.red('🚨 Error creating category:'));
					console.log(error);
				}

				process.exit(0);
			}

			try {
				console.log(chalk.bold(`Creating new ${entity}`));
				await createTransaction({
					name,
					amount: toNumber(amount),
					date: new Date(date),
					recurring,
					account: {
						...(newAccount ? {
							create: {
								name: newAccount,
							},
						} : {
							connect: getAccount(account),
						}),
					},
					category: {
						...(newCategory ? {
							create: {
								name: newCategory,
								limit: toNumber(limit),
							},
						} : {
							connect: getCategory(category),
						}),
					},
				});
				console.log(chalk.bold('🎉 New transaction created'));
			} catch (error) {
				console.log(chalk.bold.red('🚨 Error creating transaction:'));
				console.log(error);
			}

			process.exit(0);
		});
};
