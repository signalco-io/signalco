'use client';

import { useState } from 'react';
import { Button } from '@signalco/ui-primitives/Button';
import { Rocket } from '@signalco/ui-icons';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import InputSubmit from './form/InputSubmit';

function stripDomain(domain: string | number | readonly string[] | undefined) {
    return typeof domain === 'string' ? domain.replace(/https?:\/\//, '') : '';
}

export default function InputGrabDomain({ placeholder }: { placeholder?: string }) {
    const [domain, setDomain] = useSearchParam('domain');
    const [domainInput, setDomainInput] = useState(domain || '');

    const handleDomainChange = (domain: string | number | readonly string[] | undefined) => {
        setDomain(stripDomain(domain));
    }

    return (
        <InputSubmit
            placeholder={placeholder}
            aria-label="Domain"
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            onSubmit={handleDomainChange}
            endDecorator={
                <Button
                    variant="solid"
                    type="submit"
                    startDecorator={<Rocket className="mr-1 size-5" />}>
                    Grab
                </Button>
            } />
    );
}
