import { forwardRef, type ComponentProps } from 'react';
import { Button } from '../Button';

export type IconButtonProps = ComponentProps<typeof Button>;

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({ loading, children, ...rest}: IconButtonProps, ref) => {
    return (
        <Button ref={ref} loading={loading} {...rest}>
            {loading ? null : children}
        </Button>
    );
});
IconButton.displayName = 'IconButton';
export { IconButton };
