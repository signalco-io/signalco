import { Typography, type TypographyProps } from '../Typography';

export type NoDataPlaceholderProps = TypographyProps;

export function NoDataPlaceholder(props: NoDataPlaceholderProps) {
    return <Typography level="body2" {...props} />
}
