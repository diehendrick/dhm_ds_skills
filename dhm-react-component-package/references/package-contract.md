# Component package contract

## Dependency relationship

The component package consumes a published DHM token package. The token package remains independently generated and released by DHM Tokens.

```json
{
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0"
  },
  "dependencies": {
    "@scope/tokens": "^1.2.0"
  }
}
```

Use the project's real React compatibility range and token package/version. Never substitute the example scope or version without checking the package.

`react-dom` is normally also a peer dependency only when the public package imports it. Do not add it automatically for component code that only imports `react`.

## Public CSS strategy

Create a built `styles.css` entry that establishes the style order:

```css
@import '@scope/tokens/tokens.css';
@import '@scope/tokens/typography.css';
@import './components.css';
```

The actual build setup can concatenate these files rather than retain CSS `@import`; either is valid if the published `./styles.css` makes all three layers available in that order. Component styles should use `var(--...)` and `dhm-type-*` classes exported by the installed token package.

For the default explicit-CSS strategy, consumer setup is:

```ts
import { Button } from '@scope/react';
import '@scope/react/styles.css';
```

This keeps CSS loading visible and works more predictably across application bundlers and SSR than an undisclosed side effect. If a package deliberately auto-imports CSS from JavaScript, verify it in a consumer build and document the behavior.

## Minimum package exports

Every referenced path must be generated before packing:

```json
{
  "files": ["dist"],
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "default": "./dist/index.js"
    },
    "./styles.css": "./dist/styles.css"
  }
}
```

Add `require` only when the library actually emits and supports CommonJS. Add component subpaths only when they form part of the documented public API.

## Consumer smoke test

The smoke test must use the artifact, not a workspace alias. Pack the library, then in an empty temporary directory install the generated tarball normally. Add a minimal React/Vite (or target-framework) entry that imports both the package root and `styles.css`, then run a production build. Inspect a rendered component or browser result to confirm its computed styles see token variables.

This verifies package assembly and dependency resolution. It does not replace Component Lab QA, which validates the component against its DHM Component Spec.
