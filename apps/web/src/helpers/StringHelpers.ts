// TODO: Move to shared library

export const camelToSentenceCase = (value: string): string => {
  const result = value.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};
