import { Meta } from '@storybook/react';
import { Button, Container } from '@mui/material';
import React from 'react';

export default {
    title: 'Components/Button',
    component: Button,
    decorators: [
        Story => (
            <Container maxWidth='lg'>
                <Story />
            </Container>
        )
    ]
} as Meta;

export const PrimaryContained = () => <Button variant="contained" color="primary">Button</Button>;
