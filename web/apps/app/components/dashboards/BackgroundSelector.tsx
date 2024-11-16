import React from 'react';
import { cx } from '@signalco/ui-primitives/cx';
import { Button } from '@signalco/ui-primitives/Button';
import { spaceBackgroundGradients } from './Dashboards';

export function BackgroundSelector({ value, onChange }: { value?: string; onChange: (background: string | undefined) => void; }) {
    return (
        <div className="grid grid-cols-[repeat(auto-fit,40px)] gap-2">
            <Button
                className={cx(
                    'h-10 w-10 rounded-full transition-all border',
                    !value && 'ring-2 ring-primary/80 ring-offset-2'
                )}
                style={{
                    backgroundImage: 'linear-gradient(-45deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 49%, rgba(255,0,0,1) 50%, rgba(0,0,0,0) 51%, rgba(0,0,0,0) 100%)'
                }}
                onClick={() => onChange(undefined)} />
            {Object.keys(spaceBackgroundGradients).map((key) => (
                <Button
                    key={key}
                    className={cx(
                        'h-10 w-10 rounded-full transition-all border',
                        value === key && 'ring-2 ring-primary/80 ring-offset-2'
                    )}
                    style={{
                        backgroundImage: spaceBackgroundGradients[key]
                    }}
                    onClick={() => onChange(key)} />
            ))}
        </div>
    );
}
