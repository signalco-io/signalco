import { Check, Disabled } from '@signalco/ui-icons';
import { Button } from '@mui/joy';

interface DisableButtonProps {
    readonly?: boolean;
    disabled: boolean;
}

export default function DisableButton(props: DisableButtonProps) {
    const { disabled, readonly } = props;

    return (
        <Button
            disabled={readonly}
            color={disabled ? 'success' : 'warning'}
            startDecorator={disabled ? <Check /> : <Disabled />}>
            {disabled ? 'Enable' : 'Disable'}
        </Button>
    );
}
