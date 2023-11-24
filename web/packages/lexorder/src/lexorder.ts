// Inspired by:
// - https://stackoverflow.com/a/49956113/563228
// - https://stackoverflow.com/questions/38923376/return-a-new-string-that-sorts-between-two-given-strings/38927158#38927158

export type LexorderOptions = {
    start?: string;
    mid?: string;
    end?: string;
}

function trimLast(curr: string) {
    return curr.substring(0, curr.length - 1);
}

function incrementLast(curr: string | null | undefined, mid: string, end: string) {
    if (!curr) return mid;

    let nextIdentifier = String.fromCharCode(curr.charCodeAt(curr.length - 1) + 1);

    // Edge case: We are at the end, insert next level mid
    if (nextIdentifier === end)
        nextIdentifier = end + mid;

    return trimLast(curr) + nextIdentifier;
}

function decrementLast(curr: string | null | undefined, mid: string, start: string) {
    if (!curr) return mid;

    let nextIdentifier = String.fromCharCode(curr.charCodeAt(curr.length - 1) - 1);

    // Edge case: We are at the start, insert next level mid
    if (nextIdentifier === start)
        nextIdentifier = start + mid;

    return trimLast(curr) + nextIdentifier;
}

/**
 * Given two lex identifiers, returns a lex identifier that is between them.
 * Can be used to (change) item order in a list without having to re-order all items.
 *
 * @param prev Previous lex identifier
 * @param next Next lex identifier
 * @param options Options
 * @returns A lex identifier that is between prev and next
 * @example
 * lexinsert('b', 'd') // returns 'c'
 * lexinsert('b', 'c') // returns 'b' (b<mid>)
 *
 * Values are not validated, so it will procude unexpected results if you pass unsorted values:
 * lexinsert('c', 'b') // returns 'ci' (c<mid>)
 *
 * Support inserting at start or end by passing undefined:
 * lexinsert(undefined, 'c') // returns 'ai' (a<mid>)
 * lexinsert('c') // returns 'd'
 * lexinsert() // returns 'i' (<mid>)
 *
 * Not suported values are: `a` and `z` (start and end) because they are reserved for next levels.
 * Take `a` as an example: it is not possible to insert before `a` because there is nothing before `a`, so `a<mid>` is used instead.
 */
export function lexinsert(prev?: string | null | undefined, next?: string | null | undefined, options?: LexorderOptions) {
    // Charset a-z, mid arbirtary 'i' (not acutally in the middle, but it doesn't matter, counting from 'i' as developers do)
    const {
        start = 'a',
        mid = 'i',
        end = 'z'
    } = options ?? {};

    if (!prev && !next) return mid;

    // Edge case: We don't have next, if previous ran out of identifiers (last one is end), we apped next level middle to go right after that
    if (!next && prev && prev[prev.length - 1] === end)
        return prev + mid;

    // Edge case: We don't have previous, if next ran out of identifiers (first one is start), we apped next level middle to go right before that
    if (!prev && next && next[next.length - 1] === start)
        return next + mid;

    // Optimal case: Same-size, if they are next to one another we insert in mid next level
    if (prev && next &&
        prev.length === next.length &&
        prev.substring(0, prev.length - 1) === next.substring(0, next.length - 1) &&
        Math.abs(next.charCodeAt(next.length - 1) - prev.charCodeAt(prev.length - 1)) <= 1)
        return prev + mid;

    // Different size - in this case we can:
    // - decrement when next is longer
    // - increment when prev is longer
    if ((next?.length ?? 0) > (prev?.length ?? 0))
        return decrementLast(next, mid, start);
    return incrementLast(prev, mid, end);
}
