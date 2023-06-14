/** @type {import('jest').Config} */
const config = {
    verbose: true,
    testEnvironment: "jsdom",
    extensionsToTreatAsEsm: [".jsx"],
    transform: {
        "\\.[jt]sx?$": "babel-jest"
    },
    transformIgnorePatterns: []
};

module.exports = config;
