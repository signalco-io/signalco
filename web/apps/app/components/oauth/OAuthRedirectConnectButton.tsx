import { Suspense, useEffect, useState } from 'react';
import { Button } from '@signalco/ui-primitives/Button';
import { useSearchParam } from '@signalco/hooks/useSearchParam';

type OAuthRedirectConnectButtonProps = {
    label: string;
    initiateUrl: string;
    queryParamName: string;
    onCode: (code: string) => Promise<void>;
};

export default function OAuthRedirectConnectButton({ label, initiateUrl, queryParamName, onCode }: OAuthRedirectConnectButtonProps) {
    const [queryParamValue] = useSearchParam(queryParamName);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function requestAccess() {
            if (!queryParamValue)
                return;

            // TODO: Show error or success
            try {
                setIsLoading(true);
                await onCode(queryParamValue);
            } finally {
                setIsLoading(false);
            }
        }

        requestAccess();
    }, [onCode, queryParamValue]);

    // TODO: Show "Connected" if already connected
    return (
        <Suspense>
            <Button loading={isLoading} variant="solid" href={initiateUrl}>{label}</Button>
        </Suspense>
    );
}
