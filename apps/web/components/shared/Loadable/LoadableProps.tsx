import { SxProps } from '@mui/system';
import LoadableSkeletonProps from './LoadableSkeletonProps';
import LoadableLoadingErrorProps from './LoadableLoadingErrorProps';
import { ChildrenProps } from '../../../src/sharedTypes';

export default interface LoadableProps extends LoadableLoadingErrorProps, LoadableSkeletonProps, ChildrenProps {
    placeholder?: 'skeletonText' | 'skeletonRect' | 'linear' | 'circular';
    contentVisible?: boolean;
    sx?: SxProps | undefined;
}
