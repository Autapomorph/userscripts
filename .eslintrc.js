module.exports = {
  parserOptions: {
    ecmaVersion: '2022',
    sourceType: 'script',
  },
  env: {
    browser: true,
    jest: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  rules: {
    'no-restricted-globals': 'off',
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: false,
          object: false,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
  },
};
