import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import SignalcoLogotype from '../../icons/SignalcoLogotype';

export default function Cover() {
    return (
        <div className="h-[30vh]">
            <Stack className="h-full pb-24" alignItems="center" justifyContent="end">
                <SignalcoLogotype width={250} />
                <Typography level="h1" thin className="text-2xl">
                    Automate your life
                </Typography>
            </Stack>
        </div>
    );
}
