import Markdown from 'react-markdown';
import { forwardRef } from 'react';
import { Message } from 'openai/resources/beta/threads/messages';
import { cx } from '@signalco/ui-primitives/cx';

const ThreadMessage = forwardRef<HTMLDivElement, { message: Message; }>(({ message }: { message: Message; }, ref) => {
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
                    {content.type === 'text' && (
                        <div className="prose prose-sm px-1 dark:prose-invert">
                            <Markdown>{content.text?.value}</Markdown>
                        </div>
                    )}
                    {content.type === 'image_file' && <div>Image: {content.image_file?.file_id}</div>}
                </div>
            ))}
        </div>
    );
});
ThreadMessage.displayName = 'ThreadMessage';

export { ThreadMessage };
