// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  "eslint:recommended",
  "plugin:@stylistic/recommended",
  "prettier",
);
