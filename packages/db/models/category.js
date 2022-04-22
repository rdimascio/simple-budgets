import db from '../db.js';

export const getCategories = async () => {
	return await db.category.findMany();
};

export const getCategory = async (name) => {
	return await db.category.findUnique({
		where: {
			name,
		},
		include: { transactions: true }
	});
};

export const createCategory = async ({name, limit}) => {
	return await db.category.create({
		data: {
			name,
			limit,
			transactions: undefined,
		}
	});
};
