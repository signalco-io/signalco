import { Typography } from '@mui/material';
import useLocale from '../../../src/hooks/useLocale';

export default function ResultsPlaceholder() {
  const placeholders = useLocale('App', 'Placeholders');
  return (
    <Typography variant="caption" color="textSecondary">
      {placeholders.t('NoItems')}
    </Typography>
  );
}
