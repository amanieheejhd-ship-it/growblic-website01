# @growblic/eslint-config

Flat-config building blocks for Growblic tooling:

- `base` exports the common generated/build/cache ignore list without adding new rule severity.
- `next` preserves the existing Next.js Core Web Vitals and TypeScript rule sets used by both applications.
- `node` provides the neutral base for future server-tooling consumers without enabling unreviewed rules.

Applications apply the shared ignore list locally so ESLint resolves patterns from the application root. App-specific overrides and Next root settings remain the consumer's responsibility.
