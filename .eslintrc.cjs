module.exports = {
  extends: ['mantine'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'linebreak-style': ['error', 'windows'],
    'no-console': 'off',
    'import/extensions': 0,
  },
};
