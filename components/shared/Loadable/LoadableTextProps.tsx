import { ChildrenProps } from '../../../src/sharedTypes';
import LoadableLoadingErrorProps from './LoadableLoadingErrorProps';
import LoadableSkeletonProps from './LoadableSkeletonProps';

export default interface LoadableTextProps extends LoadableLoadingErrorProps, LoadableSkeletonProps, ChildrenProps {
    error?: string | React.ReactElement;
}
