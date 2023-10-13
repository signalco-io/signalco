import { Row } from '@signalco/ui/dist/Row';
import { IconButton } from '@signalco/ui/dist/IconButton';
import { GitHubIcon } from './GitHubIcon';
import { RedditIcon } from './RedditIcon';
import { XIconSvg } from './XIconSvg';

export function SignalcoSocialIcons() {
    return (
        <Row>
            <IconButton
                aria-label="X formerly known as Twitter"
                href="https://x.com/signalco_io"
                variant="plain">
                <XIconSvg />
            </IconButton>
            <IconButton
                aria-label="reddit"
                href="https://www.reddit.com/r/signalco/"
                variant="plain">
                <RedditIcon />
            </IconButton>
            <IconButton
                aria-label="GitHub"
                href="https://github.com/signalco-io/signalco"
                variant="plain">
                <GitHubIcon />
            </IconButton>
        </Row>
    );
}
