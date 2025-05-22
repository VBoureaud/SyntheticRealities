export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

export const diacriticSensitiveRegex = (string: string): string => {
  return string
    .replace(/a/g, '[aáàäâã]')
    .replace(/e/g, '[eéèëê]')
    .replace(/i/g, '[iíìïî]')
    .replace(/o/g, '[oóòöôõ]')
    .replace(/u/g, '[uúùüû]')
    .replace(/y/g, '[yýÿ]')
    .replace(/n/g, '[nñ]')
    .replace(/c/g, '[cç]');
}; 

export const addslashes = (str: string): string => {
  return str.replace(/[\\'"]/g, '\\$&');
};

export const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

