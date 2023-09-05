import { Typography } from '@signalco/ui/dist/Typography';
import { Stack } from '@signalco/ui/dist/Stack';

export function DataPart(props: { value: string; subtitle: string; }) {
    return (<Stack alignItems="center" spacing={1}>
        <Typography level="h3" component="span" lineHeight={1}>{props.value}</Typography>
        <Typography textTransform="uppercase" secondary lineHeight={1}>{props.subtitle}</Typography>
    </Stack>);
}
