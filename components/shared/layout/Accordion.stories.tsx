/* eslint-disable react/function-component-definition */
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Typography } from '@mui/joy';
import Accordion, { AccordionProps } from './Accordion';

export default {
    title: 'Components/Shared/Layout/Accordion',
    component: Accordion,
} as ComponentMeta<typeof Accordion>;

const Template: ComponentStory<typeof Accordion> = (args: AccordionProps) => {
    return (
        <Accordion {...args}>
            <Typography>Header</Typography>
            <Typography>Content</Typography>
        </Accordion>
    );
};

export const Default = Template.bind({});
