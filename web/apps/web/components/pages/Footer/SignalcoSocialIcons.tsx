import { Row } from '@signalco/ui/Row';
import { IconButton } from '@signalco/ui/IconButton';
import { XIconSvg } from './XIconSvg';
import { RedditIcon } from './RedditIcon';
import { GitHubIcon } from './GitHubIcon';

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
