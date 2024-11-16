import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { ListItem } from '@signalco/ui-primitives/ListItem';
import { Input } from '@signalco/ui-primitives/Input';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { Avatar } from '@signalco/ui-primitives/Avatar';
import { Send } from '@signalco/ui-icons';
import { initials } from '@signalco/js';
import { KnownPages } from '../../../src/knownPages';
import { ThreadMessage } from '../(app)/app/workers/[workerid]/threads/[threadid]/ThreadMessage';

export function DemoMessages() {
    return (
        <Stack spacing={4}>
            <Stack>
                <ListItem
                    label={(
                        <Stack spacing={0.5}>
                            <Typography>AI Expert</Typography>
                        </Stack>
                    )}
                    startDecorator={<Avatar size="sm" className="bg-foreground text-background">{initials('Artifical Inteligence')}</Avatar>}
                    className="group w-full" />
                <ThreadMessage message={{
                    id: '',
                    assistant_id: '',
                    completed_at: 0,
                    created_at: 0,
                    incomplete_at: 0,
                    incomplete_details: null,
                    metadata: null,
                    run_id: '',
                    status: 'completed',
                    thread_id: '',
                    object: 'thread.message',
                    role: 'assistant',
                    attachments: [],
                    content: [
                        { type: 'text', text: { value: 'Hello! How can I help you today?', annotations: [] } }
                    ]
                }} />
            </Stack>
            <Stack spacing={0.5}>
                <form action={KnownPages.App}>
                    <Input
                        type="text"
                        name="message"
                        className="bg-muted"
                        autoComplete="off"
                        placeholder="Enter message..."
                        fullWidth
                        endDecorator={(
                            <IconButton
                                title="Send message"
                                type="submit"
                                variant="plain">
                                <Send />
                            </IconButton>
                        )} />
                </form>
                <Typography level="body3" className="text-right">Interacting with AI will redirect you to the App.</Typography>
            </Stack>
        </Stack>
    );
}
