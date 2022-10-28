import { ComponentMeta, ComponentStory } from '@storybook/react';
import DashboardSettings from './DashboardSettings';
import ConfirmDeleteButton from '../shared/dialog/ConfirmDeleteButton';
import ConfigurationDialog from '../shared/dialog/ConfigurationDialog';

export default {
    title: 'Components/Dashboards/Dashboard Settings',
    component: DashboardSettings,
    subcomponents: { ConfigurationDialog, ConfirmDeleteButton },
    args: {
        isOpen: false,
        onClose: () => { }
    }
} as ComponentMeta<typeof DashboardSettings>;

const Template: ComponentStory<typeof DashboardSettings> = (args) => <DashboardSettings {...args} />;

export const Empty = Template.bind({});
