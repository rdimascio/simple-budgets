import db from '../db.js';

export const getAccounts = async () => {
	return await db.account.findMany();
};

export const getAccount = async (name) => {
	return await db.account.findUnique({
		where: {
			name,
		},
		include: { transactions: true }
	});
};

export const createAccount = async (name) => {
	return await db.account.create({
		data: {
			name,
			transactions: undefined,
		}
	});
};

export const createAccountWithTransactions = async ({name, transactions = []}) => {
	return await db.account.create({
		data: {
			name,
			transactions: {
				create: [
					...transactions,
				],
			},
		},
	});
};
