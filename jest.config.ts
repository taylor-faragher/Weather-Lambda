module.exports = {
    globals: {
        extensionsToTreatAsEsm: ['.ts', '.js'],
    },
    testMatch: ['**/*.test.ts', '**/*.test.js'],
    testEnvironment: 'node',
    roots: ['<rootDir>'],
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
