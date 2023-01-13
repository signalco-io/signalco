import { ChildrenProps } from '../sharedTypes';

export interface CollapseProps extends ChildrenProps {
    appear: boolean,
    duration?: number,
}

export default function Collapse(props: CollapseProps) {
    const { children, appear } = props;

    return (
        <div style={{
            height: appear ? 'auto' : 0, 
            overflow: 'hidden'
        }}>
            {children}
        </div>
    )
}
