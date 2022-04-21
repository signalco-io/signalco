import Loadable from './Loadable';
import LoadableTextProps from './LoadableTextProps';

export default function LoadableText(props: LoadableTextProps) {
    return <Loadable {...props} placeholder="skeletonText" />;
}
