/** @type {import('jest').Config} */
const config = {
    verbose: true,
    testEnvironment: "jsdom",
    extensionsToTreatAsEsm: [".jsx"],
    transform: {
        "\\.[jt]sx?$": "babel-jest"
    },
    transformIgnorePatterns: [],
    testPathIgnorePatterns: [
        // Temporary workaround for better-react-mathjax issue:
        // https://github.com/fast-reflexes/better-react-mathjax/issues/62
        "media/js/src/form-components/RangeEditor.test.js",
        "media/js/src/JXGBoard.test.js",
        "media/js/src/GraphEditor.test.js",
        "media/js/src/Editor.test.js",
    ],
};

module.exports = config;
