'use client';

import { useEffect, useState } from 'react';
import { Button } from '@signalco/ui-primitives/Button';
import { Rocket } from '@signalco/ui-icons';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import InputSubmit from './form/InputSubmit';
import { siteUrl } from '../src/siteUrl';

export default function InputGrabDomain({ placeholder, onRetry }: { placeholder?: string; onRetry?: () => void }) {
    const [domain, setDomain] = useSearchParam('domain');
    const [domainInput, setDomainInput] = useState(domain || '');
    const [error, setError] = useState<string>();

    useEffect(() => { setDomainInput(domain || ''); }, [domain]);

    const handleDomainChange = (input: string | number | readonly string[] | undefined) => {
        try {
            const value = typeof input === 'string' ? input.trim() : '';
            const nextDomain = value ? siteUrl(value).href : undefined;
            if (nextDomain && nextDomain === domain) onRetry?.();
            else setDomain(nextDomain);
            setError(undefined);
        } catch {
            setError('Enter a public website domain or an HTTP(S) URL.');
        }
    }

    return (
        <InputSubmit
            placeholder={placeholder ?? 'example.com or https://example.com'}
            aria-label="Domain"
            aria-invalid={Boolean(error)}
            helperText={error}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            onSubmit={handleDomainChange}
            endDecorator={
                <Button
                    className="shrink-0 whitespace-nowrap"
                    variant="solid"
                    type="submit"
                    startDecorator={<Rocket className="mr-1 size-5" />}>
                    Grab
                </Button>
            } />
    );
}
