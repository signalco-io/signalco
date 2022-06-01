import { LoadingButton } from '@mui/lab';
import { NoSsr } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function OAuthRedirectConnectButton(props: { label: string; initiateUrl: string; queryParamName: string; onCode: (code: string) => Promise<void>; }) {
    const { label, initiateUrl, queryParamName, onCode } = props;
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const queryParamValue = router.query ? router.query[queryParamName]?.toString() : undefined;

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
        <NoSsr>
            <LoadingButton loading={!router.isReady || isLoading} variant="outlined" href={initiateUrl}>{label}</LoadingButton>
        </NoSsr>
    );
}
