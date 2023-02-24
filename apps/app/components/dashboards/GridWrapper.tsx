import React from 'react';
import { ChildrenProps } from '@signalco/ui';
import DragableGridWrapper from './DragableGridWrapper';

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
