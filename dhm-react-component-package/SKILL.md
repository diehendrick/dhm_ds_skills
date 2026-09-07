---
name: dhm-react-component-package
description: Package a Component Lab React component library for npm with a versioned DHM token package. Use when preparing, validating, or releasing components without Storybook; not for implementing individual components or publishing token packages.
---

# DHM React Component Package

Package the React components and the DHM design tokens as two coordinated npm packages:

```text
<scope>/tokens  (DHM Tokens output; the only token source)
       ^
       | regular dependency
<scope>/react   (React implementation and its styles)
```

The component package must use the published token package. Do not copy generated token CSS, JSON, or CSS custom-property declarations into the component package.

Read [the package contract](references/package-contract.md) before creating or changing package configuration.

## Scope and inputs

- Apply after components have passed their Component Lab review, or when the user asks to package/release a Component Lab component library.
- This does not create or publish the DHM token package. If the requested token version is unavailable, stop and request a published package/version.
- This does not add Storybook, Code Connect, or Chromatic. The existing Storybook-oriented skill handles that workflow.
- Identify the package name, exact token package/version, source entry point, CSS strategy, package manager/registry, and whether a release is actually authorized. Do not publish or change the registry without explicit authorization.

## Build the package boundary

1. Inspect the token package's `package.json`, README, CSS exports, and manifest. Use its documented `tokens.css` and `typography.css` subpath exports verbatim.
2. Make React a `peerDependency` (and a `devDependency` needed to build/test). Make the token package a regular `dependency`, pinned or ranged according to the repository's release policy.
3. Export components from one public JS/TS entry. Include types when the project is typed. Keep non-public source, Component Specs, Lab files, tests, and development configuration out of the published artifact unless the user explicitly wants them distributed.
4. Provide a public stylesheet subpath such as `./styles.css`. It must load the generated token CSS and typography CSS before component styles. The consumer-facing usage should require only:

   ```ts
   import { Button } from '@scope/react';
   import '@scope/react/styles.css';
   ```

   A library may instead use an intentional side-effect CSS import from its JS entry only if the target bundlers and SSR environment support it. Record that decision; do not silently rely on it.
5. Keep component CSS token-backed: reference the installed package's CSS variables and generated typography classes. Do not replace token values with resolved literals merely to make the package self-contained.
6. Treat fonts and icons as separate declared dependencies or documented consumer setup. A token CSS file does not automatically load a font or icon provider. Reuse an existing approved provider; otherwise present the exact dependency and wait for authorization.

## Package exports and release safety

- Define explicit `exports` for the root entry and stylesheet. Expose any per-component entry points only when they are intended public API.
- Use a `files` allowlist or equivalent so the tarball contains only build output and required metadata. Ensure `main`, `module`, `types`, and `exports` point to actual files.
- Do not bundle React. Do not vendor the token package or generate duplicate CSS variables.
- Align component and token versions deliberately. A token update that renames/removes a referenced CSS variable requires a compatible component release; do not publish against an unverified token version.
- Do not treat Component Lab itself as a distributable dependency. It remains a local QA/review surface.

## Verification before release

1. Run the library's typecheck, tests, and production build.
2. Inspect the packed tarball with `npm pack --dry-run` or the package manager equivalent. Confirm expected entry files, CSS, types, and no `node_modules`/Lab source are included.
3. Create a temporary consumer using the packed artifact, install it normally, import a component and the public stylesheet, and build it. This proves the token package is resolved transitively and the public exports work.
4. Confirm token CSS and typography are available in that consumer and that a representative component renders with its variables resolved. This is a package integration check; Component Lab remains the visual QA source.
5. Only publish after all checks pass and the user has explicitly authorized the release.

## Handoff

Report the component package name/version, token package and resolved version, public imports, files included in the tarball, commands/check results, and any required font/icon setup. Clearly distinguish "package ready" from "published."
