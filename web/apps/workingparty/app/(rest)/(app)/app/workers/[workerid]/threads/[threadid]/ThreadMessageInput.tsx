'use client';

import { FormEvent } from 'react';
import { Tooltip } from '@signalco/ui-primitives/Tooltip';
import { Input } from '@signalco/ui-primitives/Input';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { Send } from '@signalco/ui-icons';
import { useThreadMessageSend } from '../../../../../../../../src/hooks/data/threads/useThreadMessageSend';

export function ThreadMessageInput({ workerId, threadId, isLoading }: { workerId: string, threadId: string, isLoading?: boolean }) {
    const { mutateAsync: sendThreadMessage, isPending } = useThreadMessageSend(workerId, threadId);

    const handleMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const message = formData.get('message')?.toString();
        if (!message) return;

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
                    <Tooltip title="Send message">
                        <IconButton
                            type="submit"
                            variant="plain"
                            disabled={isLoading || isPending}
                            loading={isLoading || isPending}>
                            <Send />
                        </IconButton>
                    </Tooltip>
                )} />
        </form>
    );
}
