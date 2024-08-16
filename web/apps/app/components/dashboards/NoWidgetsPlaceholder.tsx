import Image from 'next/image';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Button } from '@signalco/ui-primitives/Button';
import useLocale from '../../src/hooks/useLocale';

export function NoWidgetsPlaceholder({ onAdd }: { onAdd: () => void }) {
    const { t } = useLocale('App', 'Dashboards');

    return (
        <Stack alignItems="center" justifyContent="center">
            <Row style={{ height: '80vh' }} justifyContent="center">
                <Stack style={{ maxWidth: 320 }} spacing={4} alignItems="center" justifyContent="center">
                    <Image priority width={280} height={213} alt="No Widgets" src="/assets/placeholders/placeholder-no-widgets.svg" />
                    <Typography level="h2">{t('NoWidgets')}</Typography>
                    <Typography center level="body2">{t('NoWidgetsHelpTextFirstLine')}<br />{t('NoWidgetsHelpTextSecondLine')}</Typography>
                    <Button onClick={onAdd}>{t('AddWidget')}</Button>
                </Stack>
            </Row>
        </Stack>
    );
}