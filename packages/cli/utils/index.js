import dedent from 'strip-indent';

import {
	isNumber,
	toNumber,
	isValidDate,
	isValidDateFormat
} from '../../utils/index.js';
import help from './help.js';

/**
 * Format help text
 *
 * @param input help text
 * @returns formatted help text
 */
const format = (input = '') => dedent(input).trimRight() + '\n';

const helpMessage = format(help);

export {
	helpMessage,
	isNumber,
	isValidDate,
	isValidDateFormat,
	toNumber,
};
