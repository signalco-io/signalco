'use client';
import { useEffect, useState } from 'react';
import { cx } from '@signalco/ui-primitives/cx';
import { Check } from '@signalco/ui-icons';

type SavingIndicatorProps = {
    saving?: boolean;
};

export function SavingIndicator({ saving }: SavingIndicatorProps) {
    const [savingDelayed, setSavingDelayed] = useState(false);

    useEffect(() => {
        if (saving) {
            setSavingDelayed(true);
        } else {
            const token = setTimeout(() => {
                setSavingDelayed(false);
            }, 1000);
            return () => clearTimeout(token);
        }
    }, [saving]);

    return (
        <div aria-hidden="true" className="size-5">
            {saving && (
                <div className="animate-spin">
                    <svg
                        className=" size-full"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                        <path d="M21 3v5h-5" />
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                        <path d="M8 16H3v5" />
                    </svg>
                </div>
            )}
            <Check className={cx(
                saving && 'opacity-0 duration-0',
                !saving && savingDelayed && 'opacity-100 duration-0',
                !saving && !savingDelayed && 'opacity-0',
                'text-green-600 transition-opacity'
            )} />
        </div>
    );
}
