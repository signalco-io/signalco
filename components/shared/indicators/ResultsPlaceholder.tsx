import { Typography } from '@mui/material';
import { useLocalePlaceholders } from '../../../src/hooks/useLocale';

export default function ResultsPlaceholder() {
  const placeholders = useLocalePlaceholders();
  return (
    <Typography variant="caption" color="textSecondary">
      {placeholders.t('NoItems')}
    </Typography>
  );
}
