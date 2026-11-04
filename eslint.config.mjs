import { defineConfig } from 'eslint/config';
import eslintReact from '@eslint-react/eslint-plugin';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';

export default defineConfig([
    {
        files: [
            '**/*.mjs', '**/*.jsx'
        ],

        extends: [
            js.configs.recommended,
            eslintReact.configs.recommended,
        ],

        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.amd,
                ...globals.jquery,
            },

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
