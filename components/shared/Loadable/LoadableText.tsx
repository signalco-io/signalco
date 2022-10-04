import LoadableTextProps from './LoadableTextProps';
import Loadable from './Loadable';

export default function LoadableText(props: LoadableTextProps) {
    return <Loadable {...props} placeholder="skeletonText" />;
}
