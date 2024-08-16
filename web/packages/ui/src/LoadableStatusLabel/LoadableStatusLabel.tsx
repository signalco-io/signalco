import { Typography } from '@signalco/ui-primitives/Typography';
import { Spinner } from '@signalco/ui-primitives/Spinner';
import { ScrolledLine } from '@signalco/ui-primitives/ScrolledLine';
import { Row } from '@signalco/ui-primitives/Row';
import { Check, Error } from '@signalco/ui-icons';
import { errorText } from '@signalco/js';

export type LoadableStatusLabelProps = {
    successLabel: string;
    isLoading: boolean;
    loadingLabel: string;
    error?: unknown | string;
    className?: string;
};

export function LoadableStatusLabel({ successLabel, isLoading, loadingLabel, error, className }: LoadableStatusLabelProps) {
    const displayError = errorText(error);
    if (displayError) {
        console.warn('User presented with error:', displayError, 'original error:', error);
    }
    return (
        <ScrolledLine>
            <Row spacing={1} className="animate-in fade-in slide-in-from-top-4">
                {isLoading && (
                    <Spinner className="size-4" loadingLabel={loadingLabel} loading />
                )}
                {!isLoading && Boolean(displayError) && (
                    <Error className="size-4 text-red-400" />
                )}
                {!isLoading && !Boolean(displayError) && (
                    <Check className="size-4 text-green-400" />
                )}
                <Typography level="body2" className={className}>
                    {isLoading ? loadingLabel : (displayError ? displayError : successLabel)}
                </Typography>
            </Row>
        </ScrolledLine>
    )
}