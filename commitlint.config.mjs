/**
 * Commitlint configuration for enforcing conventional commit messages.
 * @see https://commitlint.js.org/reference/rules-configuration
 */
export default {
 // Use the standard conventional commit rules
 extends: ["@commitlint/config-conventional"],

 rules: {
  // Rule: type-enum
  // Enforces allowed types in commit messages
  // Format must start with one of these types: <type>: <subject>
  "type-enum": [
   2, // Level: 2 means "error" (1 = warning, 0 = disabled)
   "always", // Rule must always be enforced
   [
    "feat", // A new feature
    "fix", // A bug fix
    "hotfix", // An urgent fix for production
    "chore", // Tooling/config changes that don't affect app behavior
    "docs", // Documentation only changes
    "style", // Formatting changes, no logic change
    "refactor", // Code restructuring with no behavior change
    "test", // Adding or fixing tests
    "build", // Changes to build system or dependencies
    "ci", // Changes to CI config (GitHub Actions, etc.)
    "revert", // Reverting a previous commit
    "perf", // Performance improvement
   ],
  ],

  // Note: scope is optional by default.
  // A valid commit message can be:
  //   feat: add login
  // or:
  //   feat(auth): add login
 },
};
