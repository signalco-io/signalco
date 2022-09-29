import { Typography } from '@mui/material';

function NoDataPlaceholder({ content }: { content: React.ReactNode | string }) {
  return <Typography variant="subtitle2" color="textSecondary">{content}</Typography>
}

export default NoDataPlaceholder;