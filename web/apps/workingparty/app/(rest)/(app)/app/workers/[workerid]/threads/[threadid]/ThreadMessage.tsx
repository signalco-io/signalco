import Markdown from 'react-markdown';
import { forwardRef } from 'react';
import { cx } from '@signalco/ui-primitives/cx';

type SimpleMessage = { role: 'user' | 'assistant' | 'system'; content: string };
const ThreadMessage = forwardRef<HTMLDivElement, { message: SimpleMessage; }>(({ message }: { message: SimpleMessage; }, ref) => {
    const { role, content } = message;

    return (
        <div
            ref={ref}
            className={cx(
                'max-w-[80%] rounded-lg border bg-muted p-2',
                role === 'assistant' ? 'self-start dark:bg-zinc-700' : 'self-end'
            )}>
            <div className="prose prose-sm px-1 dark:prose-invert">
                <Markdown>{content}</Markdown>
            </div>
        </div>
    );
});
ThreadMessage.displayName = 'ThreadMessage';

export { ThreadMessage };
