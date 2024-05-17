const config = {
    globals: {
        extensionsToTreatAsEsm: ['.ts', '.js'],
    },

    preset: 'ts-jest/presets/js-with-ts-esm',

    // from https://stackoverflow.com/a/57916712/15076557
    // tells jest to ignore node_modules
    transformIgnorePatterns: ['/node_modules/'],
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                useESM: true,
            },
        ],
    },
};

module.exports = config;
