/**
 * @type {import('../../types').ESLintConfigExport}
 */
module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  plugins: ['test'],
  extends: [
    // 'eslint:recommended',
  ],
  ignorePatterns: ['node_modules'],
  overrides: [
    {
      files: ['src/**/*.js'],
      rules: {
        "test/enforce-foo-bar": "error",
      },
    }
  ]
};
