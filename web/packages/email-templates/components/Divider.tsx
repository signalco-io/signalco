import * as React from 'react';
import { Hr } from '@react-email/components';

export function Divider({ className }: { className?: string; }) {
    return (
        <Hr className={(className ?? '') + ' ' + 'mx-0 w-full border border-solid border-[#eaeaea]'} />
    );
}
