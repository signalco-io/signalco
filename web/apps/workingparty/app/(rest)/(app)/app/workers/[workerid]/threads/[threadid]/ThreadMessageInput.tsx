'use client';

import { FormEvent } from 'react';
import { Input } from '@signalco/ui-primitives/Input';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { Send } from '@signalco/ui-icons';
import { useThreadMessageSend } from '../../../../../../../../src/hooks/data/threads/useThreadMessageSend';

export function ThreadMessageInput({ workerId, threadId, isLoading, onMessage }: { workerId: string, threadId: string, isLoading?: boolean, onMessage?: (message: string) => void }) {
    const { mutateAsync: sendThreadMessage, isPending } = useThreadMessageSend(workerId, threadId);

    const handleMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const message = formData.get('message')?.toString();
        if (!message) return;

        // Override standard thread message behavior
        if (onMessage) {
            onMessage(message);
            return;
        }

        await sendThreadMessage(message);
    }

    return (
        <form onSubmit={handleMessage}>
            <Input
                type="text"
                name="message"
                disabled={isLoading || isPending}
                className="bg-muted"
                autoComplete="off"
                placeholder="Enter message..."
                fullWidth
                endDecorator={(
                    <IconButton
                        title="Send message"
                        type="submit"
                        variant="plain"
                        disabled={isLoading || isPending}
                        loading={isLoading || isPending}>
                        <Send />
                    </IconButton>
                )} />
        </form>
    );
}
