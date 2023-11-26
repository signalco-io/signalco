'use client';
import { useEffect, useState } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { List } from '@signalco/ui-primitives/List';
import { cx } from '@signalco/ui-primitives/cx';
import { Button } from '@signalco/ui-primitives/Button';
import { ListItem } from '../../shared/ListItem';
import { fetchGetProcessTaskDefinitionsSuggestions, useProcessTaskDefinitionsSuggestions } from '../../../src/hooks/useProcessTaskDefinitionsSuggestions';
import { useProcessTaskDefinitionCreate } from '../../../src/hooks/useProcessTaskDefinitionCreate';
import { ProcessTaskDefinitionsSuggestionsDto } from '../../../app/api/dtos/dtos';

export function TaskListSuggestions({ processId }: { processId: string; }) {
    const [suggestions, setSuggestions] = useState<ProcessTaskDefinitionsSuggestionsDto | null | undefined>();
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);
    const [suggestionsError, setSuggestionsError] = useState<unknown>();

    const aiThinkingText = 'AI is thinking...';
    const aiSuggestionsText = 'AI suggestions';

    const [aiText, setAiText] = useState<string | null>(null);
    const handleRequestSuggestions = async () => {
        if (suggestionsLoading) return;
        setSuggestionsLoading(true);
        setAiText(aiThinkingText);

        try {
            setSuggestions(await fetchGetProcessTaskDefinitionsSuggestions(processId));

            // Reset AI text (if it hasn't changed)
            setAiText(aiSuggestionsText);
            setTimeout(() => {
                setAiText((current) => current === aiSuggestionsText ? null : current);
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
                        'w-[52px] gap-2 rounded-full transition-all duration-500 justify-start overflow-hidden whitespace-nowrap',
                        aiText === aiThinkingText && 'w-44',
                        aiText === aiSuggestionsText && 'w-40'
                    )}
                    startDecorator={(
                        <div className="h-5 w-5">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 320 320"
                                width={20}
                                height={20}
                                className={cx(
                                    'fill-secondary-foreground',
                                    suggestionsLoading && 'animate-pulse'
                                )}>
                                <path d="M297.06 130.97a79.712 79.712 0 0 0-6.85-65.48c-17.46-30.4-52.56-46.04-86.84-38.68A79.747 79.747 0 0 0 143.24 0C108.2-.08 77.11 22.48 66.33 55.82a79.754 79.754 0 0 0-53.31 38.67c-17.59 30.32-13.58 68.54 9.92 94.54a79.712 79.712 0 0 0 6.85 65.48c17.46 30.4 52.56 46.04 86.84 38.68a79.687 79.687 0 0 0 60.13 26.8c35.06.09 66.16-22.49 76.94-55.86a79.754 79.754 0 0 0 53.31-38.67c17.57-30.32 13.55-68.51-9.94-94.51zM176.78 299.08a59.77 59.77 0 0 1-38.39-13.88c.49-.26 1.34-.73 1.89-1.07l63.72-36.8a10.36 10.36 0 0 0 5.24-9.07v-89.83l26.93 15.55c.29.14.48.42.52.74v74.39c-.04 33.08-26.83 59.9-59.91 59.97zM47.94 244.05a59.71 59.71 0 0 1-7.15-40.18c.47.28 1.3.79 1.89 1.13l63.72 36.8c3.23 1.89 7.23 1.89 10.47 0l77.79-44.92v31.1c.02.32-.13.63-.38.83L129.87 266c-28.69 16.52-65.33 6.7-81.92-21.95zM31.17 104.96c7-12.16 18.05-21.46 31.21-26.29 0 .55-.03 1.52-.03 2.2v73.61c-.02 3.74 1.98 7.21 5.23 9.06l77.79 44.91L118.44 224c-.27.18-.61.21-.91.08l-64.42-37.22c-28.63-16.58-38.45-53.21-21.95-81.89zm221.26 51.49-77.79-44.92 26.93-15.54c.27-.18.61-.21.91-.08l64.42 37.19c28.68 16.57 38.51 53.26 21.94 81.94a59.94 59.94 0 0 1-31.2 26.28v-75.81c.03-3.74-1.96-7.2-5.2-9.06zm26.8-40.34c-.47-.29-1.3-.79-1.89-1.13l-63.72-36.8a10.375 10.375 0 0 0-10.47 0l-77.79 44.92V92c-.02-.32.13-.63.38-.83l64.41-37.16c28.69-16.55 65.37-6.7 81.91 22a59.95 59.95 0 0 1 7.15 40.1zm-168.51 55.43-26.94-15.55a.943.943 0 0 1-.52-.74V80.86c.02-33.12 26.89-59.96 60.01-59.94 14.01 0 27.57 4.92 38.34 13.88-.49.26-1.33.73-1.89 1.07L116 72.67a10.344 10.344 0 0 0-5.24 9.06l-.04 89.79zM125.35 140 160 119.99l34.65 20V180L160 200l-34.65-20z" />
                            </svg>
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
                            startDecorator={(
                                <div className="h-[18px] w-[18px] text-center">
                                    <Typography
                                        level="body3"
                                        secondary
                                        className={cx(
                                            '[line-height:1.6em]'
                                        )}>AI*</Typography>
                                </div>
                            )} />
                    ))}
                </List>
            )}
        </Stack>
    );
}
