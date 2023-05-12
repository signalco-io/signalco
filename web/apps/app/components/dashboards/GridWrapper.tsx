import { PropsWithChildren } from 'react';
import DragableGridWrapper from './DragableGridWrapper';

export default function GridWrapper(props: PropsWithChildren<{ order: string[]; isEditing: boolean; orderChanged: (newOrder: string[]) => void; }>) {
    const { isEditing, children, ...rest } = props;
    if (isEditing) {
        return (
            <DragableGridWrapper {...rest}>
                {children}
            </DragableGridWrapper>
        );
    } else
        return <>{children}</>;
}
