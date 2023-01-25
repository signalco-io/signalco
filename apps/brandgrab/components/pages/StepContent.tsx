'use client';

import { useInView } from 'react-cool-inview';
import React, { type CSSProperties } from 'react';
import { Typography, Grid, Fade, GentleSlide, MuiStack } from '@signalco/ui';
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
            <MuiStack spacing={{ xs: 6, md: 12 }} ref={observe}>
                <MuiStack spacing={{ xs: 2, md: 4 }}>
                    <GentleSlide appear={inView} direction="down">
                        <Typography level="h3" component="h2" textAlign="center">{props.header}</Typography>
                    </GentleSlide>
                    {props.subtitle && (
                        <GentleSlide appear={inView} direction="down" index={1}>
                            <Typography level="body2" textAlign="center">{props.subtitle}</Typography>
                        </GentleSlide>
                    )}
                </MuiStack>
                <div>
                    <Grid container spacing={8} alignItems="center">
                        {props.image && (
                            <Grid xs={12} md={6} sx={{ position: 'relative', height: props.imageContainerHeight }}>
                                <Fade appear={inView} duration={1400}>
                                    <div style={props.imageContainerStyles}>
                                        {props.image}
                                    </div>
                                </Fade>
                            </Grid>
                        )}
                        {props.children && (
                            <Grid xs={12} md={props.image ? 6 : 12}>
                                <MuiStack
                                    sx={{
                                        gap: 4,
                                        flexDirection: props.direction === 'horizontal' ? { xs: 'column', md: 'row' } : 'column'
                                    }}>
                                    {(Array.isArray(props.children) ? props.children : [props.children]).map((child, childIndex) => (
                                        <GentleSlide
                                            key={childIndex}
                                            appear={inView}
                                            index={childIndex}>
                                            {child}
                                        </GentleSlide>
                                    ))}
                                </MuiStack>
                            </Grid>
                        )}
                    </Grid>
                </div>
            </MuiStack>
        </SectionCenter>
    );
}
