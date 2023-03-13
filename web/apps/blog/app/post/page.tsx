import Typography from '@signalco/ui/dist/Typography';
import Stack from '@signalco/ui/dist/Stack';
import Row from '@signalco/ui/dist/Row';
import Link from '@signalco/ui/dist/Link';
import Container from '@signalco/ui/dist/Container';
import Chip from '@signalco/ui/dist/Chip';
import { KnownPages } from '../../src/knownPages';

export default function PostPage() {
    return (
        <Stack spacing={8}>
            <Link href={KnownPages.Blog}>Back to Blog</Link>
            <Stack spacing={2}>
                <Row spacing={1}>
                    <Chip size="lg"><Typography>Category</Typography></Chip>
                    <Typography>{new Date().toDateString()}</Typography>
                </Row>
                <Stack spacing={2}>
                    <Typography level="h1">Header</Typography>
                    <Typography level="h2" fontSize="1.5em" secondary semiBold>Description</Typography>
                </Stack>
            </Stack>
            <Container maxWidth="md" centered={false} padded={false}>
                <Typography>Content</Typography>
            </Container>
        </Stack>
    );
}
