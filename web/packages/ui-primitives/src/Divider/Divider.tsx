import { cx } from '../cx'

export function Divider({orientation = 'horizontal'} : {orientation?: 'horizontal' | 'vertical'}) {
    return (
        <div className={cx(
            'shrink-0 bg-border',
            orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]')} />
    );
}
