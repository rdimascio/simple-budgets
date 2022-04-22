/**
 * Validates that a date matches a given format.
 *
 * @param {string} dateString - Date string.
 * @return {boolean} - True if valid, false if not.
 */
export const isValidDateFormat = (dateString, format = /^(\d{2})(-|\/)(\d{2})(-|\/)(\d{4})$/) => {
    return typeof dateString === 'string' && dateString.match(format) !== null;
};

/**
 * Validates that a given string is a valid date.
 *
 * @param {string} dateString Date string.
 * @return {boolean} - True if valid, false if not.
 */
export const isValidDate = (dateString) => {
    return !Number.isNaN(Date.parse(dateString));
};
