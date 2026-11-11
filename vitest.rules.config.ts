import { defineConfig } from 'vitest/config';

// Security-rule tests. Run with `npm run test:rules`, which starts the
// Firestore emulator first.
export default defineConfig({
  test: { include: ['tests/rules/**/*.test.ts'], environment: 'node', testTimeout: 20000, fileParallelism: false },
});
