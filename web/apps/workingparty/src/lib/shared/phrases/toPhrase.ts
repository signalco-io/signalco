import { words } from './shortWordsList';

export function toPhrase(token: string) {
    const wordsLength = words.length;
    const tokenLength = token.length;
    const firstPart = token.slice(0, tokenLength / 2);
    const secondPart = token.slice(tokenLength / 2);

    const multiplier = Math.random() * 100;

    const firstPartHash = Math.floor(firstPart.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) * multiplier);
    const secondPartHash = Math.floor(secondPart.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) * multiplier);

    const word1 = words[firstPartHash % wordsLength] ?? 'working';
    const word2 = words[secondPartHash % wordsLength] ?? 'party';

    return `${word1[0]?.toUpperCase()}${word1.slice(1)} ${word2[0]?.toUpperCase()}${word2.slice(1)}`;
}