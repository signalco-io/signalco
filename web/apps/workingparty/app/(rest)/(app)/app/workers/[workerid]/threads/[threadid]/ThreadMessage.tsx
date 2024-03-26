import Markdown from 'react-markdown';
import { forwardRef } from 'react';
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages.mjs';
import { cx } from '@signalco/ui-primitives/cx';

const ThreadMessage = forwardRef<HTMLDivElement, { message: ThreadMessage; }>(({ message }: { message: ThreadMessage; }, ref) => {
    const { role, content: contents } = message;

    return (
        <div
            ref={ref}
            className={cx(
                'max-w-[80%] rounded-lg border bg-muted p-2',
                role === 'assistant' ? 'self-start dark:bg-zinc-700' : 'self-end'
            )}>
            {contents?.map((content, j) => (
                <div key={j}>
                    {content.type === 'text' && <Markdown className="prose prose-sm px-1 dark:prose-invert">{content.text?.value}</Markdown>}
                    {content.type === 'image_file' && <div>Image: {content.image_file?.file_id}</div>}
                </div>
            ))}
        </div>
    );
});
ThreadMessage.displayName = 'ThreadMessage';

export { ThreadMessage };
