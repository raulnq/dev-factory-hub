import jseslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default defineConfig(
  globalIgnores(['**/dist/**/*', '**/node_modules/**/*', '**/*.tsbuildinfo']),
  jseslint.configs.recommended,
  tseslint.configs.recommended,
  prettierConfig,
  {
    files: ['eslint.config.ts', 'commitlint.config.ts', 'prettier.config.ts'],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: './tsconfig.json',
      },
    },
  },
  {
    files: ['apps/backend/**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: './apps/backend/tsconfig.json',
      },
    },
  },
  {
    files: ['apps/frontend/src/**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: './apps/frontend/tsconfig.app.json',
      },
    },
  },
  {
    files: ['apps/frontend/vite.config.ts'],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: './apps/frontend/tsconfig.node.json',
      },
    },
  }
);
