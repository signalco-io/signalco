import * as React from 'react';
import { PropsWithChildren } from 'react';
import { Text } from '@react-email/components';

export function Paragraph({ children, className }: PropsWithChildren<{ className?: string; }>) {
    return (
        <Text className={(className ?? '') + ' ' + 'text-[14px] leading-[24px] text-black'}>
            {children}
        </Text>
    );
}
