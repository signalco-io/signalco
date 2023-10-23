import { cx } from 'classix'

export function Divider({orientation = 'horizontal'} : {orientation?: 'horizontal' | 'vertical'}) {
    return (
        <div className={cx(
            'uitw-shrink-0 uitw-bg-border',
            orientation === 'horizontal' ? 'uitw-h-[1px] uitw-w-full' : 'uitw-h-full uitw-w-[1px]')} />
    );
}
