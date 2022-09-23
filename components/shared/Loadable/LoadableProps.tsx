import { SxProps, Theme } from '@mui/material';
import { ChildrenProps } from '../../../src/sharedTypes';
import LoadableLoadingErrorProps from './LoadableLoadingErrorProps';
import LoadableSkeletonProps from './LoadableSkeletonProps';

export default interface LoadableProps extends LoadableLoadingErrorProps, LoadableSkeletonProps, ChildrenProps {
    placeholder?: 'skeletonText' | 'skeletonRect' | 'linear' | 'circular';
    contentVisible?: boolean;
    sx?: SxProps<Theme> | undefined;
}
