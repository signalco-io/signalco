import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Typography } from '@mui/material';
import LoadableTextProps from './LoadableTextProps';
import LoadableText from './LoadableText';

export default {
    title: 'Components/Shared/LoadableText',
    component: LoadableText,
    args: {
        children: <Typography>Content</Typography>
    }
} as ComponentMeta<typeof LoadableText>;

function LoadableTextTemplate(args: LoadableTextProps) { return <LoadableText {...args} />; }
const Template: ComponentStory<typeof LoadableText> = LoadableTextTemplate;

export const Default = Template.bind({});

export const LoadingDefault = Template.bind({});
LoadingDefault.args = { isLoading: true };

export const Error = Template.bind({});
Error.args = { error: 'Unknown error' };
