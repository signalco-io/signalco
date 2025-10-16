import type { StorybookConfig } from '@storybook/nextjs';
import path from 'path';

const _require = typeof require === 'undefined' ? import.meta : require;
const getAbsolutePath = (packageName: string): any =>
  path.dirname(_require.resolve(path.join(packageName, 'package.json'))).replace(/^file:\/\//, '');

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],

  addons: [
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-themes"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-vitest"),
    getAbsolutePath("@storybook/addon-styling-webpack")
  ],

  framework: {
    name: getAbsolutePath("@storybook/nextjs"),
    options: {}
  }
};

export default config;
