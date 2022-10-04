import LoadableSkeletonProps from './LoadableSkeletonProps';
import LoadableLoadingErrorProps from './LoadableLoadingErrorProps';
import { ChildrenProps } from '../../../src/sharedTypes';

export default interface LoadableTextProps extends LoadableLoadingErrorProps, LoadableSkeletonProps, ChildrenProps {
    error?: string | React.ReactElement;
}
