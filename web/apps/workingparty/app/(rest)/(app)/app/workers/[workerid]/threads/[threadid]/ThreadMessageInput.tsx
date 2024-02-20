'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Row } from '@signalco/ui-primitives/Row';
import { Input } from '@signalco/ui-primitives/Input';
import { Button } from '@signalco/ui-primitives/Button';
import { Send } from '@signalco/ui-icons';

async function sendThreadMessage(workerId: string, threadId: string, message: string) {
    const response = await fetch('/api/workers/' + workerId + '/threads/' + threadId + '/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
    });
    const run = await response.json() as { runId: string };
    return run.runId;
}

export function ThreadMessageInput({ workerId, threadId }: { workerId: string, threadId: string }) {
    const client = useQueryClient();
    const [isSending, setSending] = useState(false);

    const handleMessage = async (formData: FormData) => {
        try {
            setSending(true);
            const message = formData.get('message')?.toString();
            if (!message) return;

            await sendThreadMessage(workerId, threadId, message);
        } finally {
            client.invalidateQueries({
                queryKey: ['threadMessages', { threadId }]
            });
            setSending(false);
        }
    }

    return (
        <form action={handleMessage}>
            <Row spacing={1}>
                <Input type="text" name="message" disabled={isSending} />
                <Button
                    type="submit"
                    disabled={isSending}
                    loading={isSending}
                    startDecorator={<Send className="min-h-4 min-w-4" />}>
                    Send
                </Button>
            </Row>
        </form>
    );
}
