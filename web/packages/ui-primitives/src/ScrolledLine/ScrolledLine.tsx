import { HTMLAttributes, useEffect, useState } from 'react';
import { cx } from '../cx';

export type ScrolledLineProps = HTMLAttributes<HTMLDivElement> & {
    /**
     * @default 100
     * @description The duration of the animation in milliseconds.
     *              Must be smaller then animation duration (which is 150ms by default)
     */
    animationDuration?: number;
};

export function ScrolledLine({ children, animationDuration = 100, className, ...rest }: ScrolledLineProps) {
    const [currentChildren, setCurrentChildren] = useState(children);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentChildren(children);
        }, animationDuration);
        return () => clearInterval(interval);
    }, [animationDuration, children]);

    return (
        <div className={cx(
            children === currentChildren && 'animate-in fade-in slide-in-from-top-2',
            children !== currentChildren && 'animate-out fade-out slide-out-to-bottom-2',
            className
        )}
            {...rest}>
            {currentChildren}
        </div>
    );
}