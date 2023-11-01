import { Link } from '@signalco/ui/dist/Link';
import { KnownPages } from '../../src/knownPages';

export default function LandingPage() {
    return (
        <div>
            Welcome
            <Link href={KnownPages.Processes}>Processes</Link>
        </div>
    );
}
