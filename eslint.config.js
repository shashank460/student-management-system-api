import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  eslint.configs.recommended,
  {
    ignores: ['node_modules/**'],
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  }
]);
