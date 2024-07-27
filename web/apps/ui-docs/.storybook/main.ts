// import { join, dirname } from "path";
import type { StorybookConfig } from '@storybook/react-vite';

// /**
//  * This function is used to resolve the absolute path of a package.
//  * It is needed in projects that use Yarn PnP or are set up within a monorepo.
//  */
// function getAbsolutePath(value: string) {
//   return dirname(require.resolve(join(value, "package.json")));
// }

const config: StorybookConfig = {
  stories: ["../stories"],
  addons: [
    // getAbsolutePath("@storybook/addon-links"),
    // getAbsolutePath("@storybook/addon-essentials"),
    // getAbsolutePath("@storybook/addon-themes")
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-themes'
  ],
  framework: '@storybook/react-vite', // 👈 Add this
  docs: {
    autodocs: true
  }
};

export default config;
