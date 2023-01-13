'use client';

import { useInView } from 'react-cool-inview';
import React, { type CSSProperties } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Stack, Container, Button, Divider, Typography, Grid, Box, Fade, GentleSlide, MuiStack } from '@signalco/ui';

const Newsletter = dynamic(() => import('../pages/landing/Newsletter'));

function FeatureDescription(props: { header: string, content: string | React.ReactElement, link?: string, linkText?: string }) {
    return (
        <Stack spacing={2}>
            <Typography level="h5" component="h3">{props.header}</Typography>
            <Typography textColor="neutral.400">{props.content}</Typography>
            <div>
                {props.link && (
                    <Link passHref href={props.link}>
                        <Button variant="outlined">{props.linkText ?? 'Read more'}</Button>
                    </Link>
                )}
            </div>
        </Stack>
    );
}

function StepContent(props: {
  header: string;
  direction?: 'vertical' | 'horizontal'
  subtitle?: string;
  image?: React.ReactNode,
  imageContainerHeight?: number,
  imageContainerStyles?: CSSProperties | undefined,
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

function SectionCenter(props: { children?: React.ReactNode | undefined, style?: CSSProperties | undefined, narrow?: boolean }) {
    return (
        <section style={props.style}>
            <Container>
                <Box sx={{ px: { xs: 1, sm: 4, md: 8 }, py: { xs: props.narrow ? 4 : 8, sm: props.narrow ? 4 : 12 } }}>
                    {props.children}
                </Box>
            </Container>
        </section>
    );
}

function NewsletterSection() {
    const { observe, inView } = useInView({
        onEnter: ({ unobserve }) => unobserve(), // only run once
    });

    return (
        <div ref={observe}>
            <SectionCenter>
                {inView && <Newsletter />}
            </SectionCenter>
        </div>
    );
}

export default function LandingPageView() {
    return (
        <Stack style={{ overflowX: 'hidden' }}>
            <StepContent header="BrandGrab">
            </StepContent>
            <Divider />
            <NewsletterSection />
        </Stack>
    );
}
