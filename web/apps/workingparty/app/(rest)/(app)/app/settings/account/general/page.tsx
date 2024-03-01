import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Input } from '@signalco/ui-primitives/Input';
import { Container } from '@signalco/ui-primitives/Container';
import { Button } from '@signalco/ui-primitives/Button';
import { SettingsCardActions } from '../../../../../../../src/components/settings/SettingsCardActions';
import { SettingsCard } from '../../../../../../../src/components/settings/SettingsCard';

export default function SettingsAccountGeneralPage() {
    const accountName = 'aleksandar.toplek@gmail.com\'s account';

    return (
        <Container className="py-4" padded maxWidth="md">
            <Stack spacing={4}>
                <Typography level="h1" className="text-2xl">Account</Typography>
                <SettingsCard header="Account Name">
                    <Stack spacing={2}>
                        <Typography level="body1" secondary>The account name visible to users. For example, the name of your company or department.</Typography>
                        <Input value={accountName} />
                    </Stack>
                    <SettingsCardActions className="justify-end">
                        <Button size="sm" variant="solid">
                            Save
                        </Button>
                    </SettingsCardActions>
                </SettingsCard>
            </Stack>
        </Container>
    )
}