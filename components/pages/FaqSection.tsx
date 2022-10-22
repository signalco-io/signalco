import { Box, Stack } from '@mui/system';
import { Typography } from '@mui/joy';
import Container from 'components/shared/layout/Container';
import Accordion from 'components/shared/layout/Accordion';
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
                    <Stack spacing={4} justifyItems="center" alignItems="center">
                        <Stack spacing={2}>
                            {faq.map(f => (
                                <Accordion key={f.id}>
                                    <Typography level="h6">{f.question}</Typography>
                                    <Typography>{f.answer}</Typography>
                                </Accordion>
                            ))}
                        </Stack>
                        {/* TODO: Enable when help center is available */}
                        {/* <Button href="/help" variant="outlined" size="large">Visit help center</Button> */}
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}
