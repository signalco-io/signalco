import { Stack } from '@signalco/ui-primitives/Stack';
import { Row, RowProps } from '@signalco/ui-primitives/Row';
import { Divider } from '@signalco/ui-primitives/Divider';
import { cx } from '@signalco/ui-primitives/cx';

export function SettingsCardActions({ children, className }: RowProps) {
    return (
        <Stack spacing={2} className="-mx-8 -mb-8">
            <Divider />
            <Row className={cx('px-8 pb-4', className)}>
                {children}
            </Row>
        </Stack>
    );
}
