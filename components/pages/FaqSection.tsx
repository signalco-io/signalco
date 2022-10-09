import { Box, Stack } from '@mui/system';
import { Card, Typography } from '@mui/joy';
import Container from 'components/shared/layout/Container';
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
                                <Card variant="soft" key={f.id}>
                                    <Stack spacing={1}>
                                        <Typography level="h6">{f.question}</Typography>
                                        <Typography>{f.answer}</Typography>
                                    </Stack>
                                </Card>
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
