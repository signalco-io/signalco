'use client';

import { useState } from 'react';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import InputSubmit from './form/InputSubmit';

function stripDomain(domain: string) {
    return domain.replace(/https?:\/\//, '');
}

export default function InputGrabDomain({ placeholder }: { placeholder?: string }) {
    const [domain, setDomain] = useSearchParam('domain');
    const [domainInput, setDomainInput] = useState(domain || '');

    const handleDomainChange = (domain: string) => {
        setDomain(stripDomain(domain));
    }

    return (
        <InputSubmit
            value={domainInput}
            placeholder={placeholder}
            aria-label="Domain"
            onChange={(e) => setDomainInput(e.target.value)}
            onSubmit={handleDomainChange} />
    );
}
