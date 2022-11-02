import { Typography } from '@mui/joy';

function NoDataPlaceholder({ content }: { content: React.ReactNode | string }) {
  return <Typography level="body2">{content}</Typography>
}

export default NoDataPlaceholder;
