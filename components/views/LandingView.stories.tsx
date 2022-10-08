import { ComponentMeta, ComponentStory } from '@storybook/react';
import LandingPageView from './LandingView';

export default {
    title: 'Views/LandingView',
    component: LandingPageView
} as ComponentMeta<typeof LandingPageView>;

function ViewTemplate() { return <LandingPageView />; }
const Template: ComponentStory<typeof LandingPageView> = ViewTemplate;

export const Default = Template.bind({});
