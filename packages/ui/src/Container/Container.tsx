import { Breakpoint, Container as SystemContainer } from '@mui/system';
import { ChildrenProps } from '../sharedTypes';

export interface ContainerProps extends ChildrenProps {
    maxWidth?: Breakpoint | false
}

export default function Container(props: ContainerProps) {
    return (
        <SystemContainer maxWidth={props.maxWidth}>
            {props.children}
        </SystemContainer>
    )
}
