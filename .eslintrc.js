module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    "@typescript-eslint",
  ],
  rules: {
    "prettier/prettier": 0,
  },
};
