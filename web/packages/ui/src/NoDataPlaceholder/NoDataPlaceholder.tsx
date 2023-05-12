import { Typography } from '@mui/joy';

export type NoDataPlaceholderProps = {
  content: React.ReactNode | string;
};

export function NoDataPlaceholder({ content }: NoDataPlaceholderProps) {
  return <Typography level="body2">{content}</Typography>
}
