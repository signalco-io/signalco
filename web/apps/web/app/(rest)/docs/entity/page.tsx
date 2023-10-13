import {Stack} from '@signalco/ui/dist/Stack';

export default function EntityDocsPage() {
    return (
        <Stack>
            <h3>Special contacts</h3>
            <p>
                <strong>offline</strong>
                <span>Conditions for entity to be offline are as follows:</span>
                <ul>
                    <li>when there is no "offline", entity doesn't have state or state is <i>online</i> by default</li>
                    <li>when there is exactly one "offline" - that status is respected</li>
                    <li>when there are more "offline" contacts - device is <i>offline</i> when any of them is offline</li>
                </ul>
            </p>
            <p>battery</p>
            <p>linkquality (planned)</p>
            <p>visit or visit-*</p>
            <br />
            <h3>Special contacts for Station entities</h3>
            <p>stationReleaseChannel</p>
        </Stack>
    );
}
