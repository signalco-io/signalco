import { forwardRef, type ComponentProps } from 'react';
import { Button } from '../Button';

export type IconButtonProps = ComponentProps<typeof Button>;

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>((props: IconButtonProps, ref) => {
    return <Button ref={ref} {...props} />;
});
IconButton.displayName = 'IconButton';
export { IconButton };
