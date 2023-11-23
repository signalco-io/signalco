import { twMerge } from 'tailwind-merge';
import { cx as ClassixCx } from 'classix';

export function cx(...rest: (string | boolean | null | undefined)[]) {
    return twMerge(ClassixCx(...rest));
}
