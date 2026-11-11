import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: '/057Cafe/',
  test: {
    include: ['tests/**/*.test.ts'],
    exclude: ['tests/rules/**'],
    environment: 'node',
  },
});
