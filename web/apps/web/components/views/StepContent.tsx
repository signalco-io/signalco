'use client';

import { useInView } from 'react-cool-inview';
import React, { type CSSProperties } from 'react';
import { cx } from 'classix';
import { Typography } from '@signalco/ui/dist/Typography';
import { Stack } from '@signalco/ui/dist/Stack';
import { GentleSlide } from '@signalco/ui/dist/GentleSlide';
import { Fade } from '@signalco/ui/dist/Fade';
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
    const { observe, inView } = useInView({
        onEnter: ({ unobserve }) => unobserve(), // only run once
    });

    return (
        <SectionCenter>
            <div ref={observe}>
                <Stack spacing={6}>
                    <Stack spacing={3}>
                        <GentleSlide appear={inView} direction="down">
                            <Typography level="h3" component="h2" textAlign="center">{props.header}</Typography>
                        </GentleSlide>
                        {props.subtitle && (
                            <GentleSlide appear={inView} direction="down" index={1}>
                                <Typography level="body2" textAlign="center">{props.subtitle}</Typography>
                            </GentleSlide>
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
                                <Fade appear={inView} duration={1400}>
                                    <div style={props.imageContainerStyles}>
                                        {props.image}
                                    </div>
                                </Fade>
                            </div>
                        )}
                        {props.children && (
                            <div className={cx(
                                'flex gap-8',
                                props.direction === 'vertical' ? 'flex-col' : 'flex-col sm:flex-row'
                            )}>
                                {(Array.isArray(props.children) ? props.children : [props.children]).map((child, childIndex) => (
                                    <GentleSlide
                                        key={childIndex}
                                        appear={inView}
                                        index={childIndex}>
                                        {child}
                                    </GentleSlide>
                                ))}
                            </div>
                        )}
                    </div>
                </Stack>
            </div>
        </SectionCenter>
    );
}
