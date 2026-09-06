// Remove BG TW — ESLint 9 flat config
// v3.0.2 — Fleet alignment
import nextPlugin from "eslint-config-next"

export default [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "next-env.d.ts",
      "*.tsbuildinfo",
    ],
  },
  ...nextPlugin,
]
