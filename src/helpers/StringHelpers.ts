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

export const isAbsoluteUrl = (value: string | null): boolean => {
  if (value == null) return false;
  const match = value.match(/^https?:\/\//);
  return match != null && match.length > 0;
};

export const hexToRgb = (hex: string) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}