module.exports = {
  "env": {
    "node": true,
    "es2021": true
  },
  "extends": ["eslint:recommended", "prettier", "plugin:@typescript-eslint/recommended"],
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module"
  },
  parser: "@typescript-eslint/parser",
  "plugins": ["prettier", '@typescript-eslint'],
  root: true,
  "rules": {
    "prettier/prettier": "error",
    "arrow-parens": ["error", "as-needed"],
    "space-in-parens": ["error", "never"],
    "no-spaced-func": "error",
    "object-curly-spacing": ["error", "always"],
    "computed-property-spacing": ["error", "never"],
    "array-bracket-spacing": ["error", "never"],
    "space-unary-ops": "error",
    "comma-spacing": ["error", { "before": false, "after": true }],
    "comma-style": ["error", "last"],
    "space-infix-ops": ["error", { "int32Hint": false }],
    "keyword-spacing": ["error", { "before": true }],
    "prefer-arrow-callback": "error",
    "no-promise-executor-return": "error",
    "comma-dangle": ["error", "never"],
    "no-sequences": "error",
    "max-len": ["error", { "code": 180, "ignoreComments": true }],
    "quote-props": ["error", "as-needed"],
    "jsx-quotes": ["error", "prefer-double"],
    "no-console": "error",
    "no-trailing-spaces": "error",
    "no-multi-spaces": "error",
    "padded-blocks": ["error", "never"],
    "arrow-spacing": ["error", { "before": true, "after": true }],
    "key-spacing": ["error", { "beforeColon": false }],
    "no-multiple-empty-lines": [
      "error",
      {
        "max": 1,
        "maxEOF": 1
      }
    ],
    "no-await-in-loop": "error",
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "single"],
    "semi": ["error", "never"]
  }
};
