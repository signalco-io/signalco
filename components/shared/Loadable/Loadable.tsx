import { Alert, Box, CircularProgress, LinearProgress, Skeleton } from '@mui/material';
import { useMemo } from 'react';
import LoadableProps from './LoadableProps';

export default function Loadable(props: LoadableProps) {
    const {isLoading, placeholder, error, children, width, height, contentVisible, sx} = props;

    const indicator = useMemo(() => {
        switch (placeholder) {
            case 'skeletonText':
                return <Skeleton variant="text" width={width ?? 120} />;
            case 'skeletonRect':
                return <Skeleton variant="rectangular" width={width ?? 120} height={height ?? 32} />;
            case 'linear':
                return <LinearProgress variant="indeterminate" />
            case 'circular':
            default:
                return <Box textAlign="center"><CircularProgress /></Box>
        }
    }, [height, placeholder, width]);

    if (error) {
        return <Alert variant="filled" severity="error">{error}</Alert>
    }

    return (
        <>
            {(contentVisible || isLoading) && (
                <Box visibility={isLoading ? 'visible' : 'hidden'} sx={sx}>
                    {indicator}
                </Box>
            )}
            {(contentVisible || !isLoading) && children}
        </>
    );
}
