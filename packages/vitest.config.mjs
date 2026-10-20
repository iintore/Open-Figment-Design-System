// Tests for the built npm packages (run `npm run packages:build` first).
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { include: ['packages/__tests__/**/*.test.{ts,tsx}'], environment: 'node' },
});
