import db from '../db.js';

export const getTransactions = async () => {
	return await db.transaction.findMany();
};

export const createTransaction = async (transaction) => {
	return await db.transaction.create({
		data: transaction,
	});
};

export const createTransactions = async (transactions = []) => {
	return Promise.all(
		transactions.map(async (transaction) => {
			return await db.transaction.create({
				data: transaction,
			})
		})
	);
};
