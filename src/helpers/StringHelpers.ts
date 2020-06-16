export const trimStartChar = (value: string, char: string): string => {
  while (value.charAt(0) == char) {
    value = value.substring(1);
  }
  return value;
};
