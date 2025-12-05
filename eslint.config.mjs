// eslint.config.mjs
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["src/**/*.js", "tests/**/*.js"],
    languageOptions: {
      globals: {
        // Browser
        document: true,
        localStorage: true,
        alert: true,
        // Node/CommonJS
        require: true,
        module: true,
        // Jest
        describe: true,
        test: true,
        expect: true,
        beforeEach: true
      }
    },
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "double"]
    }
  }
];
