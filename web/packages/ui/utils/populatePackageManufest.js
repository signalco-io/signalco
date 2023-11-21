import { globSync } from 'glob';
import packageJson from '../package.json' assert { type: 'json' };

const files = globSync('src/**/index.ts', {})
console.log('test')
console.log(files);

// Process all component files
const componentFiles = files.map((file) => {
    // Example: 'src\\TypographyEditable\\index.ts'
    // Extract component name
    const componentName = file.split('\\')[1];

    // Example: "./Stack": { "import": "./dist/Stack/index.js", "types": "./dist/Stack/index.d.ts" }
    // Create import object
    const importObject = {
        import: `./dist/${componentName}/index.js`,
        types: `./dist/${componentName}/index.d.ts`,
    };

    // Return import object
    return [`./${componentName}`, importObject];
});

// Create package.json
const packageManifest = {
    ...packageJson,
    exports: {
        ...packageJson.exports,
        '.': {
            ...packageJson.exports['.'],
            ...Object.fromEntries(componentFiles),
        },
    },
};

// Write package.json
writeFileSync('dist/package.json', JSON.stringify(packageManifest, null, 4));
