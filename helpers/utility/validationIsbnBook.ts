/**
 * Validate if a given string is a valid ISBN-10 or ISBN-13.
 * ISBN-10: 10 digits with optional dashes.
 * ISBN-13: 13 digits with optional dashes.
 * @param isbn The ISBN to validate.
 * @returns `true` if the ISBN is valid, otherwise `false`.
 */
export function isValidISBN(isbn: string): boolean {
  const isbn10Regex = /^(?:\d[ |-]?){9}[\dX]$/;
  const isbn13Regex = /^(?:\d[ |-]?){13}$/;

  // Remove any non-digit characters for easier validation
  const cleanedISBN = isbn.replace(/[^0-9X]/g, '');

  if (isbn10Regex.test(isbn)) {
    return isValidISBN10(cleanedISBN);
  } else if (isbn13Regex.test(isbn)) {
    return isValidISBN13(cleanedISBN);
  }

  return false;
}

function isValidISBN10(isbn: string): boolean {
  if (isbn.length !== 10) {
    return false;
  }

  const checksum = isbn
    .split('')
    .map((char, index) => (char === 'X' ? 10 : Number(char)) * (10 - index))
    .reduce((sum, value) => sum + value, 0);

  return checksum % 11 === 0;
}

function isValidISBN13(isbn: string): boolean {
  if (isbn.length !== 13) {
    return false;
  }

  const checksum = isbn
    .split('')
    .map((char, index) => Number(char) * (index % 2 === 0 ? 1 : 3))
    .reduce((sum, value) => sum + value, 0);

  return checksum % 10 === 0;
}
