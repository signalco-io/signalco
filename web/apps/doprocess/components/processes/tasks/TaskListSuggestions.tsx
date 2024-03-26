'use client';

import { useState } from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { ListItem } from '@signalco/ui-primitives/ListItem';
import { List } from '@signalco/ui-primitives/List';
import { cx } from '@signalco/ui-primitives/cx';
import { Button } from '@signalco/ui-primitives/Button';
import { AI } from '@signalco/ui-icons';
import { fetchGetProcessTaskDefinitionsSuggestions } from '../../../src/hooks/useProcessTaskDefinitionsSuggestions';
import { useProcessTaskDefinitionCreate } from '../../../src/hooks/useProcessTaskDefinitionCreate';
import { ProcessTaskDefinitionsSuggestionsDto } from '../../../app/api/dtos/dtos';

export function TaskListSuggestions({ processId }: { processId: string; }) {
    const [suggestions, setSuggestions] = useState<ProcessTaskDefinitionsSuggestionsDto | null | undefined>();
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);
    const [suggestionsError, setSuggestionsError] = useState<unknown>();

    const aiEmptyText = 'AI';
    const aiThinkingText = 'AI is thinking...';
    const aiSuggestionsText = 'AI suggestions';

    const [aiText, setAiText] = useState<string>(aiEmptyText);
    const handleRequestSuggestions = async () => {
        if (suggestionsLoading) return;
        setSuggestionsLoading(true);
        setAiText(aiThinkingText);

        try {
            setSuggestions(await fetchGetProcessTaskDefinitionsSuggestions(processId));

            // Reset AI text (if it hasn't changed)
            setAiText(aiSuggestionsText);
            setTimeout(() => {
                setAiText((current) => current === aiSuggestionsText ? aiEmptyText : current);
            }, 2000);
        } catch(err) {
            setSuggestionsError(err);
        } finally {
            setSuggestionsLoading(false);
        }
    };

    const createTaskDefinition = useProcessTaskDefinitionCreate();
    const handleSuggestionSelected = async (suggestion: string) => {
        await createTaskDefinition.mutateAsync({
            processId,
            text: suggestion,
        });

        // Remove suggestions from list
        setSuggestions((curr) => curr ? ({
            ...curr,
            suggestions: curr.suggestions.filter((s) => s !== suggestion),
        }) : null);
    }

    if (suggestionsError) {
        console.error(suggestionsError);
        return null;
    }

    return (
        <Stack spacing={1}>
            <div className="self-end animate-in fade-in">
                <Button
                    onClick={handleRequestSuggestions}
                    className={cx(
                        'w-[72px] gap-2 rounded-full transition-all duration-500 justify-start overflow-hidden whitespace-nowrap',
                        aiText === aiThinkingText && 'w-44',
                        aiText === aiSuggestionsText && 'w-40'
                    )}
                    startDecorator={(
                        <div className="flex size-5 flex-row gap-1">
                            <AI
                                size={20}
                                className={cx(
                                    'min-w-[20px] h-5 fill-secondary-foreground',
                                    suggestionsLoading && 'animate-pulse'
                                )} />
                        </div>
                    )}>
                    {aiText}
                </Button>
            </div>
            {Boolean(suggestions?.suggestions.length) && (
                <List className="divide-y rounded-lg border animate-in slide-in-from-right-4 slide-in-from-top-4">
                    {suggestions?.suggestions.map((suggestion) => (
                        <ListItem
                            key={suggestion}
                            label={suggestion}
                            nodeId={suggestion}
                            onSelected={() => handleSuggestionSelected(suggestion)}
                            className="w-full gap-2 px-3 text-base"
                            variant="outlined"
                            startDecorator={(
                                <div className="text-center">
                                    <AI size={18} className="h-[18px] min-w-[18px]" opacity={0.7} />
                                </div>
                            )} />
                    ))}
                </List>
            )}
        </Stack>
    );
}
