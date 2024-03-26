import { Stack, StackProps } from '../Stack';
import { cx } from '../cx';

export type ListProps = StackProps & {
    /**
     * @default 'plain'
     */
    variant?: 'outlined' | 'plain';
};

export function List({ variant = 'plain', className, ...rest }: ListProps) {
    return (
        <Stack
            className={cx(
                variant === 'outlined' && 'divide-y rounded-lg border',
                className
            )}
            {...rest} />
    );
}
