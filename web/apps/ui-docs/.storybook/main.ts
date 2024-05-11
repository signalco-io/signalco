import { join, dirname } from "path";
import type { StorybookConfig } from '@storybook/nextjs';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string) {
  return dirname(require.resolve(join(value, "package.json")));
}

const config: StorybookConfig = {
  stories: ["../stories"],
  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-themes")
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {
      builder: {
        useSWC: true
      }
    }
  },
  docs: {
    autodocs: true
  }
};

export default config;
