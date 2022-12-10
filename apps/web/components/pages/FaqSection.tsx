import { Accordion, Container, Typography, Box, Stack } from '@signalco/ui';
import PageCenterHeader from './PageCenterHeader';

export interface FaqItem {
    id: string,
    question: string,
    answer: string
};

export default function FaqSection(props: { faq: FaqItem[] }) {
    const { faq } = props;

    return (
        <Box sx={{ alignSelf: 'center' }}>
            <Container maxWidth="md">
                <Stack spacing={4}>
                    <PageCenterHeader header={'Frequently asked questions'} secondary />
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
        </Box>
    );
}
