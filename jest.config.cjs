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
        // Temporary workaround for mathjax3-react issue:
        // https://github.com/asnunes/mathjax3-react/issues/30
        "media/js/src/form-components/RangeEditor.test.js",
        "media/js/src/JXGBoard.test.js",
        "media/js/src/GraphEditor.test.js",
        "media/js/src/Editor.test.js",
    ],
};

module.exports = config;
