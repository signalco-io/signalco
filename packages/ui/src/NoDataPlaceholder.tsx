import { Typography } from '@mui/joy';

export default function NoDataPlaceholder({ content }: { content: React.ReactNode | string }) {
  return <Typography level="body2">{content}</Typography>
}
