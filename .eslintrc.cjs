module.exports = {
    "env": {
        "browser": true,
        "amd": true,
        "jquery": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:security/recommended-legacy"
    ],
    "parser": "@babel/eslint-parser",
    "parserOptions": {
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "settings": {
        "react": {
            "version": "detect"
        }
    },
    "plugins": [
        "react",
        "security"
    ],
    "rules": {
        "indent": [
            "error",
            4,
            {SwitchCase: 1}
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "no-unused-vars": [
            "error",
            {"vars": "all", "args": "none"}
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],

        'security/detect-buffer-noassert': 1,
        'security/detect-child-process': 1,
        'security/detect-disable-mustache-escape': 1,
        'security/detect-eval-with-expression': 1,
        'security/detect-new-buffer': 1,
        'security/detect-no-csrf-before-method-override': 1,
        'security/detect-non-literal-fs-filename': 1,
        'security/detect-non-literal-regexp': 1,
        'security/detect-non-literal-require': 0, /* requirejs conflict */
        'security/detect-object-injection': 0, /* several false positives */
        'security/detect-possible-timing-attacks': 1,
        'security/detect-pseudoRandomBytes': 1,
        'security/detect-unsafe-regex': 1
    }
};
