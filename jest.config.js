export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    globals: {
        'ts-jest': {
            useESM: true,
            tsconfig: 'tsconfig.app.json'
        },
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
};
