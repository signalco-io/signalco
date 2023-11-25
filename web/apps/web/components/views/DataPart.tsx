import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';

export function DataPart(props: { value: string; subtitle: string; }) {
    return (<Stack alignItems="center" spacing={1}>
        <Typography level="h3" component="span">{props.value}</Typography>
        <Typography uppercase secondary>{props.subtitle}</Typography>
    </Stack>);
}
