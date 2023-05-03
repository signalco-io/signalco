import {Typography} from '@signalco/ui/dist/Typography';
import {Stack} from '@signalco/ui/dist/Stack';
import {Row} from '@signalco/ui/dist/Row';
import {Container} from '@signalco/ui/dist/Container';
import {Chip} from '@signalco/ui/dist/Chip';
import HelloWorld, { meta } from './hello-world.mdx';

export default function Page() {
    const date = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(new Date(meta.date));

    return (
        <Stack spacing={8}>
            <Stack spacing={2}>
                <Row spacing={1}>
                    <Chip size="lg"><Typography level="body2" secondary semiBold>{meta.category}</Typography></Chip>
                    <Typography level="body2" tertiary>{date}</Typography>
                </Row>
                <Stack spacing={2}>
                    <Typography level="h1">{meta.title}</Typography>
                    <Typography level="h2" fontSize="1.5em" secondary semiBold>{meta.description}</Typography>
                </Stack>
            </Stack>
            <Container maxWidth="md" centered={false} padded={false}>
                <HelloWorld />
            </Container>
        </Stack>
    );
}
