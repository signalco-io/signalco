'use client';
import { useInView } from 'react-cool-inview';
import React, { type CSSProperties } from 'react';
import { Typography } from '@signalco/ui/dist/Typography';
import { Stack } from '@signalco/ui/dist/Stack';
import { Grid } from '@signalco/ui/dist/Grid';
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
                    <div>
                        <Grid container spacing={8} alignItems="center">
                            {props.image && (
                                <Grid xs={12} md={6} className="relative" style={{ height: props.imageContainerHeight }}>
                                    <Fade appear={inView} duration={1400}>
                                        <div style={props.imageContainerStyles}>
                                            {props.image}
                                        </div>
                                    </Fade>
                                </Grid>
                            )}
                            {props.children && (
                                <Grid xs={12} md={props.image ? 6 : 12}>
                                    <Stack spacing={4}>
                                        {(Array.isArray(props.children) ? props.children : [props.children]).map((child, childIndex) => (
                                            <GentleSlide
                                                key={childIndex}
                                                appear={inView}
                                                index={childIndex}>
                                                {child}
                                            </GentleSlide>
                                        ))}
                                    </Stack>
                                </Grid>
                            )}
                        </Grid>
                    </div>
                </Stack>
            </div>
        </SectionCenter>
    );
}
