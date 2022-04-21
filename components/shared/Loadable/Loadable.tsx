import { Alert, CircularProgress, LinearProgress, Skeleton } from '@mui/material';
import LoadableProps from './LoadableProps';

export default function Loadable(props: LoadableProps) {
    if (props.isLoading) {
        switch (props.placeholder) {
            case 'skeletonText':
                return <Skeleton variant="text" width={props.width ?? 120} />;
            case 'skeletonRect':
                return <Skeleton variant="rectangular" width={props.width ?? 120} height={props.height ?? 32} />;
            case 'linear':
                return <LinearProgress variant="indeterminate" />
            case 'circular':
            default:
                return <CircularProgress />
        }
    }

    if (props.error) {
        return <Alert variant="filled" color="error">{props.error}</Alert>
    }

    return <>{props.children}</>;
}
