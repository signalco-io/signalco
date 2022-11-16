import { Typography } from '@mui/joy';

export function NoDataPlaceholder({ content }: { content: React.ReactNode | string }) {
  return <Typography level="body2">{content}</Typography>
}
