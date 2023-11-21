import { cx as ClassixCx } from 'classix';
import { twMerge } from 'tailwind-merge';

export function cx(...rest: (string | boolean | null | undefined)[]) {
    return twMerge(ClassixCx(...rest));
}
