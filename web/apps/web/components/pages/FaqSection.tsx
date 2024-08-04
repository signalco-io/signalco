import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Container } from '@signalco/ui-primitives/Container';
import { Accordion } from '@signalco/ui/Accordion';
import PageCenterHeader from './PageCenterHeader';

export interface FaqItem {
    id: string,
    question: string,
    answer: string
}

export default function FaqSection({ faq }: { faq: FaqItem[] }) {
    return (
        <div className="self-center">
            <Container maxWidth="md">
                <Stack spacing={2}>
                    <PageCenterHeader secondary>
                        Frequently asked questions
                    </PageCenterHeader>
                    <Stack spacing={2}>
                        {faq.map(f => (
                            <Accordion key={f.id}>
                                <Typography level="h6">{f.question}</Typography>
                                <Typography>{f.answer}</Typography>
                            </Accordion>
                        ))}
                    </Stack>
                </Stack>
            </Container>
        </div>
    );
}
