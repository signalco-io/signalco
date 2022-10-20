import { Typography } from '@mui/joy';
import { useLocalePlaceholders } from '../../../src/hooks/useLocale';

export default function ResultsPlaceholder() {
  const placeholders = useLocalePlaceholders();
  return (
    <Typography level="body2">
      {placeholders.t('NoItems')}
    </Typography>
  );
}
