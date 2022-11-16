import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Stack } from '@mui/system';
import { Button, Typography } from '@mui/joy';
import {Loadable} from './Loadable';

export default {
    title: 'Components/Shared/Loadable',
    component: Loadable,
    args: {
        children: <Typography>Content</Typography>
    }
} as ComponentMeta<typeof Loadable>;

const Template: ComponentStory<typeof Loadable> = (args) => <Loadable {...args} />;

export const Default = Template.bind({});

export const LoadingDefault = Template.bind({});
LoadingDefault.args = { isLoading: true };

export const LoadingText = Template.bind({});
LoadingText.args = { placeholder: 'skeletonText', isLoading: true };

export const LoadingRect = Template.bind({});
LoadingRect.args = { placeholder: 'skeletonRect', isLoading: true };

export const LoadingLinear = Template.bind({});
LoadingLinear.args = { placeholder: 'linear', isLoading: true };

export const Error = Template.bind({});
Error.args = { error: 'Unknown error' };

export const ErrorLongText = Template.bind({});
ErrorLongText.args = { error: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dapibus velit quam, sed tempor ligula ornare sit amet. Praesent sit amet nunc a nisl placerat faucibus a quis erat. Vestibulum tincidunt rhoncus magna nec suscipit. Ut egestas interdum faucibus. Phasellus vitae turpis rutrum, dictum nulla sed, pretium nunc. Nunc interdum sem ut mi suscipit fermentum. Maecenas vitae imperdiet leo. Mauris suscipit, nisl eu vulputate mattis, velit mi semper risus, quis aliquet dui nunc nec justo. Nunc euismod porta facilisis.' };

export const ErrorComponent = Template.bind({});
ErrorComponent.args = { error: <Stack spacing={2}><Typography>Error</Typography><Button variant="outlined">Retry</Button></Stack> };
