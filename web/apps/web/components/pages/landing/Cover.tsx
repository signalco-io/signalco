import { Typography } from '@signalco/ui/Typography';
import { Stack } from '@signalco/ui/Stack';
import SignalcoLogotype from '../../icons/SignalcoLogotype';

export default function Cover() {
    return (
        <div className="h-[30vh]">
            <Stack className="h-full pb-24" alignItems="center" justifyContent="end">
                <SignalcoLogotype width={250} />
                <Typography level="h1" thin fontSize="1.4rem">
                    Automate your life
                </Typography>
            </Stack>
        </div>
    );
}
