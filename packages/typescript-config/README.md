# @growblic/typescript-config

Config-only TypeScript presets for the Growblic workspace:

- `base.json` preserves the strict Bundler-mode options shared by every current consumer.
- `nextjs.json` preserves the two Next.js apps' compiler, JSX, DOM, incremental, and plugin settings.
- `node.json` preserves the database package's Node.js and ES2022 settings.
- `library.json` preserves the browser-safe contracts and validation packages' ES2022/DOM settings.

Consumers retain their own paths, include/exclude patterns, and generated-type locations. The package contains no runtime code or environment values.
