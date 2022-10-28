import { ChildrenProps } from 'src/sharedTypes';

export interface TypographyProps extends ChildrenProps {
    gutterBottom?: boolean | undefined;
    level?: string | undefined;
}

export default function Typography(props: TypographyProps) {
    return (
        <div>{props.children}</div>
    );
}
