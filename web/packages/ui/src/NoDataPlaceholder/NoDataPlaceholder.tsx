import { Typography } from '@mui/joy';

/** @alpha */
export type NoDataPlaceholderProps = {
  content: React.ReactNode | string;
};

/** @alpha */
export default function NoDataPlaceholder({ content }: NoDataPlaceholderProps) {
  return <Typography level="body2">{content}</Typography>
}
