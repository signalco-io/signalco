import { cx } from 'classix';
import { Navigate } from '@signalco/ui-icons';
import { Button, ButtonProps } from '../Button';

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
            className={cx(hideArrow && 'uitw-group/nav-button', className)}
            startDecorator={hideArrow && (
                <span className="uitw-w-4 uitw-pr-1" />
            )}
            endDecorator={(
                <span className={cx(
                    'uitw-pl-1',
                    hideArrow && 'uitw-transition-opacity uitw-opacity-0 uitw-group-hover/nav-button:opacity-100'
                )}>
                    <Navigate size={16} />
                </span>
            )}
            {...rest}
        />
    );
}
