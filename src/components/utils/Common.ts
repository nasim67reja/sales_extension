/**
 * Truncates a string based on the specified word limit.
 * @param inputString - The original string to be truncated.
 * @param wordLimit - The maximum number of words to retain.
 * @returns The truncated string with an ellipsis (...) at the end if needed.
 */
export const truncateString = (
  inputString: string,
  wordLimit: number
): string => {
  if (!inputString) return "";
  const words = inputString.split(" ");

  if (words.length <= wordLimit) {
    return inputString;
  }

  const truncatedWords = words.slice(0, wordLimit);
  const truncatedString = truncatedWords.join(" ") + "...";

  return truncatedString;
};

export const truncateStringCharacter = (
  inputString: string,
  charLimit: number
): string => {
  if (!inputString) return "";

  if (inputString.length <= charLimit) {
    return inputString;
  }

  const truncatedString = inputString.slice(0, charLimit) + "...";

  return truncatedString;
};

// This will return the current date
export const getFormattedDate = (): string => {
  const today = new Date();

  const day = today.getDate().toString().padStart(2, "0");
  const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
};
