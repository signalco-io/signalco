import React, { type CSSProperties } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { cx } from '@signalco/ui-primitives/cx';
import { SectionCenter } from './SectionCenter';

export function StepContent(props: {
    header: string;
    direction?: 'vertical' | 'horizontal';
    subtitle?: string;
    image?: React.ReactNode;
    imageContainerHeight?: number;
    imageContainerStyles?: CSSProperties | undefined;
    children?: React.ReactNode | React.ReactNode[];
}) {
    return (
        <SectionCenter>
            <Stack spacing={6}>
                <Stack spacing={3}>
                    <Typography level="h3" component="h2" center>{props.header}</Typography>
                    {props.subtitle && (
                        <Typography level="body2" center>{props.subtitle}</Typography>
                    )}
                </Stack>
                <div className={cx(
                    'grid xs:grid-cols-1 gap-8',
                    Boolean(props.image) && 'md:grid-cols-2'
                )}>
                    {props.image && (
                        <div
                            className={'relative h-[--height]'}
                            style={{ '--height': `${props.imageContainerHeight}px` } as CSSProperties}>
                            <div style={props.imageContainerStyles}>
                                {props.image}
                            </div>
                        </div>
                    )}
                    {props.children && (
                        <div className={cx(
                            'flex gap-8',
                            props.direction === 'horizontal' && 'flex-col md:flex-row',
                            props.direction !== 'vertical' && 'flex-col'
                        )}>
                            {props.children}
                        </div>
                    )}
                </div>
            </Stack>
        </SectionCenter>
    );
}
