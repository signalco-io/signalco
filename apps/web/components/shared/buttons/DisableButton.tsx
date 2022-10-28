import { Button } from '@mui/joy';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import CheckIcon from '@mui/icons-material/Check';

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
            startDecorator={disabled ? <CheckIcon /> : <NotInterestedIcon />}>
            {disabled ? 'Enable' : 'Disable'}
        </Button>
    );
}
