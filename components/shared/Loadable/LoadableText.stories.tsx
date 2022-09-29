import { Typography } from '@mui/material';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import LoadableText from './LoadableText';
import LoadableTextProps from './LoadableTextProps';

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
