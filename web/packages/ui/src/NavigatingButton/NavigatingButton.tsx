import { cx } from '@signalco/ui-primitives/cx';
import { Button, ButtonProps } from '@signalco/ui-primitives/Button';
import { Navigate } from '@signalco/ui-icons';

export type NavigatingButtonProps = ButtonProps & {
    hideArrow?: boolean;
};

export function NavigatingButton({
    hideArrow,
    className,
    ...rest
}: NavigatingButtonProps) {
    return (
        <Button
            color="primary"
            variant={hideArrow ? 'plain' : 'solid'}
            className={cx(hideArrow && 'group/nav-button', className)}
            startDecorator={hideArrow && (
                <span className="w-4 pr-1" />
            )}
            endDecorator={(
                <span className={cx(
                    'pl-1',
                    hideArrow && 'transition-opacity opacity-0 group-hover/nav-button:opacity-100'
                )}>
                    <Navigate size={16} />
                </span>
            )}
            {...rest}
        />
    );
}
