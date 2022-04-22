import papaparse from 'papaparse';
const { parse, unparse } = papaparse;

const parseCSV = (csv) => parse(csv);

const formatCSV = (csv) => {
	const headers = csv[0].map((header) => header.trim());
	const [, ...data] = csv;

	return data
		.map((row) =>
			headers.reduce(
				(obj, header, i) => ({
					...obj,
					[header]: row[i]?.trim(),
				}),
				{}
			)
		)
		.filter(Boolean);
};

export const isValidCsv = (csv) => {
	if (!csv) {
		return {
			errors: ['Uploaded CSV file is empty.'],
		};
	}

	const parsedCsv = parseCSV(csv);
	if (!Boolean(parsedCsv) || Boolean(parsedCsv.errors?.length)) {
		return {
			errors: parsedCsv.errors.map((error) => error.message),
		};
	}

	const data = formatCSV(parsedCsv.data);
	if (!data.length) {
		return {
			errors: ['Uploaded CSV file is empty.'],
		};
	}

	return true;
};

export const csvToJson = (document) => {
	const csv = parseCSV(document);
	return formatCSV(csv.data);
};

export const jsonToCSV = (data = []) => unparse(data);
