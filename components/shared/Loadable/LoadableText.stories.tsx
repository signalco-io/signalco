import { Typography } from '@mui/material';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import LoadableText from './LoadableText';

export default {
    title: 'Components/Shared/LoadableText',
    component: LoadableText,
    args: {
        children: <Typography>Content</Typography>
    }
} as ComponentMeta<typeof LoadableText>;

const Template: ComponentStory<typeof LoadableText> = (args) => <LoadableText {...args} />;

export const Default = Template.bind({});

export const LoadingDefault = Template.bind({});
LoadingDefault.args = { isLoading: true };

export const Error = Template.bind({});
Error.args = { error: 'Unknown error' };
