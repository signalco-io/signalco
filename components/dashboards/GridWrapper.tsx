import React from 'react';
import DragableGridWrapper from './DragableGridWrapper';
import { ChildrenProps } from '../../src/sharedTypes';

export default function GridWrapper(props: { order: string[]; isEditing: boolean; orderChanged: (newOrder: string[]) => void; } & ChildrenProps) {
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
