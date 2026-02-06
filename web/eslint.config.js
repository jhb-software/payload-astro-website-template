import eslintPluginAstro from 'eslint-plugin-astro'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    },
  },

  // see https://ota-meshi.github.io/eslint-plugin-astro
  eslintPluginAstro.configs.recommended,
  eslintPluginAstro.configs['jsx-a11y-strict'],
  {
    rules: {
      // The following rules are not included in the "recommended" config
      'astro/no-set-text-directive': 'warn',
      'astro/no-unused-css-selector': 'warn',

      // The following rules should be enabled in the future (refactoring required)
      // 'astro/prefer-class-list-directive': 'warn',
      // 'astro/sort-attributes': 'warn',
    },
  },
)
