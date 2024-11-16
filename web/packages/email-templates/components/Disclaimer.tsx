import * as React from 'react';
import { PropsWithChildren } from 'react';
import { Text } from '@react-email/components';

export function Disclaimer({ children, className }: PropsWithChildren<{ className?: string; }>) {
    return (
        <Text className={(className ?? '') + ' ' + 'text-[12px] leading-[24px] text-tertiary-foreground'}>
            {children}
        </Text>
    );
}
