import { useInView } from 'react-cool-inview';
import { cx } from 'classix';
import { Typography } from '@signalco/ui/dist/Typography';
import { GentleSlide } from '@signalco/ui/dist/GentleSlide';


function CounterIndicator(props: { count: number, hideAfter?: boolean }) {
    const { observe, inView } = useInView({
        onEnter: ({ unobserve }) => unobserve(), // only run once
    });

    return (
        <GentleSlide appear={inView} direction="down">
            <div ref={observe} style={{
                margin: 'auto',
                display: 'flex',
                width: '42px',
                height: props.hideAfter ? '106px' : '170px',
                alignItems: props.hideAfter ? 'end' : 'center'
            }}>
                <div
                    className={cx(
                        'pt-0.5 w-10 h-10 rounded-full text-[var(--joy-palette-background-body)] bg-foreground relative select-none',
                        'before:content-[\'\'] before:block before:h-16 before:w-px before:absolute before:left-5 before:top-[-64px] before:rotate-180 before:bg-gradient-to-b before:from-foreground before:to-transparent',
                        'after:content-[\'\'] after:block after:h-16 after:w-px after:absolute after:left-5 after:top-[40px] after:bg-gradient-to-b after:from-foreground after:to-transparent'
                    )}>
                    <Typography textAlign="center" fontSize={23}>{props.count}</Typography>
                </div>
            </div>
        </GentleSlide>
    );
}

export default CounterIndicator;
