/**
 * Capitalize the first letter of a string.
 * @param text - The input string.
 * @returns The string with the first letter capitalized.
 */
export const capitalize = (text: string): string => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const allCaps = (text: string): string => {
  if (!text) return "";
  return text.toUpperCase();
};
