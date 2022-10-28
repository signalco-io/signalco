import { ChildrenProps } from 'src/sharedTypes';

export interface CardProps extends ChildrenProps {
    sx?: any;
}

export default function Card(props: CardProps) {
    return (
        <div>{props.children}</div>
    )
}
