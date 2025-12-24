import { defineConfig } from 'eslint/config';
import react from 'eslint-plugin-react';
import security from 'eslint-plugin-security';
import globals from 'globals';
import babelParser from '@babel/eslint-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([
    js.configs.recommended, {
        extends: compat.extends(
            'eslint:recommended',
            'plugin:react/recommended',
            'plugin:security/recommended-legacy',
        ),

        plugins: {
            react,
            security,
        },

        files: [
            '**/*.mjs', '**/*.jsx'
        ],

        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.amd,
                ...globals.jquery,
            },

            parser: babelParser,
            ecmaVersion: 'latest',
            sourceType: 'module',

            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },

        settings: {
            react: {
                version: 'detect',
            },
        },

        rules: {
            indent: ['error', 4, {
                SwitchCase: 1,
            }],

            'linebreak-style': ['error', 'unix'],

            'no-unused-vars': ['error', {
                vars: 'all',
                args: 'none',
            }],

            'react/prop-types': 'off',

            quotes: ['error', 'single'],
            semi: ['error', 'always'],
            'security/detect-buffer-noassert': 1,
            'security/detect-child-process': 1,
            'security/detect-disable-mustache-escape': 1,
            'security/detect-eval-with-expression': 1,
            'security/detect-new-buffer': 1,
            'security/detect-no-csrf-before-method-override': 1,
            'security/detect-non-literal-fs-filename': 1,
            'security/detect-non-literal-regexp': 1,
            'security/detect-non-literal-require': 0,
            'security/detect-object-injection': 0,
            'security/detect-possible-timing-attacks': 1,
            'security/detect-pseudoRandomBytes': 1,
            'security/detect-unsafe-regex': 1,
        },
    }, {
        files: ['**/*.js'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.jquery
            }
        }
    }, {
        files: ['**/*.test.js', '**/*.test.jsx', '**/*.test.mjs'],
        languageOptions: {
            globals: {
                ...globals.jest,
            }
        }
    }
]);
