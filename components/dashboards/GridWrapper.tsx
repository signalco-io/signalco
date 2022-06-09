import React from 'react';
import { ChildrenProps } from '../../src/sharedTypes';
import { DragableGridWrapper } from './DragableGridWrapper';

export function GridWrapper(props: { order: string[]; isEditing: boolean; orderChanged: (newOrder: string[]) => void; } & ChildrenProps) {
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
