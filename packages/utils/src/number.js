
/**
 * Converts a value to a number
 *
 * @param {*} value value to convert
 * @return {number} Number
 */
 const toNumber = (value) => {
	if ('number' === typeof value) {
		return Object.is(value, NaN) ? NaN : value;
	}

	if ('string' !== typeof value) {
		return NaN;
	}

	const number = value.replace(/[^0-9]/g, '');
	if (!number.length) {
		return NaN;
	}

	return Number(number);
};

/**
 * Checks to see if a value can be a number
 *
 * @param {*} value value to check
 * @return {boolean} true if number
 */
const isNumber = (value) => {
	if ('number' === typeof value) {
		return !isNaN(value);
	}

	if ('string' !== typeof value) {
		return false;
	}

	// Return false for any text that contains
	// a letter in the first character
	const hasLetterFirst = value.charAt(0).match(/[a-zA-Z]/);
	if (null !== hasLetterFirst) {
		return false;
	}

	const number = toNumber(value);

	// Explicitly check for NaN
	if (Object.is(number, NaN)) {
		return false;
	}

	return !isNaN(number);
};

export {
	isNumber,
	toNumber,
};
