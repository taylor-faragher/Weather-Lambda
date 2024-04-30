const config = {
    globals: {
        extensionsToTreatAsEsm: ['.ts', '.js'],
    },

    preset: 'ts-jest/presets/js-with-ts-esm',

    // from https://stackoverflow.com/a/57916712/15076557
    transformIgnorePatterns: [
        'node_modules/(?!(module-that-needs-to-be-transformed)/)' 
    ],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            useESM: true
        }]
    }
}

module.exports = config