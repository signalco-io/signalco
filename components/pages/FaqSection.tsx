import { Stack, Container } from '@mui/system';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { Typography } from '@mui/joy';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PageCenterHeader from './PageCenterHeader';

export interface FaqItem {
    id: string,
    question: string,
    answer: string
};

export default function FaqSection(props: { faq: FaqItem[] }) {
    const { faq } = props;

    return (
        <Stack spacing={4}>
            <PageCenterHeader header={'Frequently asked questions'} secondary />
            <Container maxWidth="md" sx={{ alignSelf: 'center' }}>
                <Stack spacing={4} justifyItems="center" alignItems="center">
                    <section>
                        {faq.map(f => (
                            <Accordion key={f.id}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>{f.question}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {f.answer}
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </section>
                    {/* TODO: Enable when help center is available */}
                    {/* <Button href="/help" variant="outlined" size="large">Visit help center</Button> */}
                </Stack>
            </Container>
        </Stack>
    );
}
