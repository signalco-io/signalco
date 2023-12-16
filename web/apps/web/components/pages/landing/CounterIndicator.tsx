import { Typography } from '@signalco/ui-primitives/Typography';
import { cx } from '@signalco/ui-primitives/cx';

function CounterIndicator(props: { count: number, hideAfter?: boolean }) {
    return (
        <div
            className={cx(
                'm-auto flex w-[42px]',
                !props.hideAfter && 'h-[170px] items-center',
                props.hideAfter && 'h-[106px] items-end'
            )}>
            <div
                className={cx(
                    'pt-0.5 w-10 h-10 rounded-full text-background bg-foreground relative select-none',
                    'before:content-[\'\'] before:block before:h-16 before:w-px before:absolute before:left-5 before:top-[-64px] before:rotate-180 before:bg-gradient-to-b before:from-foreground before:to-transparent',
                    !props.hideAfter && 'after:content-[\'\'] after:block after:h-16 after:w-px after:absolute after:left-5 after:top-[40px] after:bg-gradient-to-b after:from-foreground after:to-transparent'
                )}>
                <Typography center className="text-2xl">{props.count}</Typography>
            </div>
        </ div>
    );
}

export default CounterIndicator;
