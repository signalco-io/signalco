import { Typography, type TypographyProps } from '@signalco/ui-primitives/Typography';

export type NoDataPlaceholderProps = TypographyProps;

export function NoDataPlaceholder(props: NoDataPlaceholderProps) {
    return <Typography level="body2" secondary {...props} />
}
