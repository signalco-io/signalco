import ShareIcon from '@mui/icons-material/Share';
import useIsClient from 'src/hooks/useIsClient';
import IconButtonCopyToClipboard from 'components/shared/buttons/IconButtonCopyToClipboard';

export default function ShareSocial() {
    const isClient = useIsClient();
    if (!isClient)
        return null;

    const value = window.location.href;
    return (
        <IconButtonCopyToClipboard title="Copy link to clipboard" value={value}>
            <ShareIcon />
        </IconButtonCopyToClipboard>
    );
}
