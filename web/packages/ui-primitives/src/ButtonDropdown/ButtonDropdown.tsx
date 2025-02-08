import { forwardRef } from 'react'
import { Select } from '@signalco/ui-icons';
import { cx } from '../cx';
import { Button, ButtonProps } from '../Button/Button';

const ButtonDropdown = forwardRef<HTMLButtonElement, ButtonProps>(({ className, ...rest }, ref) => {
    return (
        <Button
            ref={ref}
            className={cx(
                'flex-none grid text-start',
                Boolean(rest.startDecorator) && 'grid-cols-[auto,1fr,auto]',
                !Boolean(rest.startDecorator) && 'grid-cols-[1fr,auto]',
                className)}
            endDecorator={<Select className="size-4" />}
            {...rest} />
    )
});
ButtonDropdown.displayName = 'ButtonDropdown'
export { ButtonDropdown };
