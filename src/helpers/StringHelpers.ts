export const trimStartChar = (value: string, char: string): string => {
  while (value.charAt(0) == char) {
    value = value.substring(1);
  }
  return value;
};

export const camelToSentenceCase = (value: string): string => {
  const result = value.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

export const isUrl = (value: string | null): boolean => {
  if (value == null) return false;
  const match = value.match(/^https?:\/\//);
  return match != null && match.length > 0;
};
