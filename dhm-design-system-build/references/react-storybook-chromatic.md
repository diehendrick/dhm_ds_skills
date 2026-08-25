# React, Storybook, and Chromatic adapter

Use this reference only for React + CSS Modules component libraries.

## Package boundary

- Keep `@scope/tokens` as a direct dependency, pinned to the selected released version.
- Import `@scope/tokens/tokens.css` and `@scope/tokens/typography.css` from the public entry point. Import the same files in `.storybook/preview.ts`.
- Do not reproduce package variables in `src/index.css`, Tailwind configuration, or generated local JSON.
- Use the actual token package manifest to determine names and supported modes.

## Component pattern

- Use CSS Modules and native pseudo-classes.
- Use semantic tokens first and primitives only when the package has no semantic equivalent.
- Map each text-bearing element to a generated `.dhm-type-*` class from `typography.css`. Apply the class in TSX, not by duplicating its font declarations in the CSS Module.
- Record each mapping in `component-contract.json`. For a Material outlined text field, use `body/default` for input and suffix, `body/tiny` for the floating label, and `caption/small` for helper text when those composites exist.
- Do not declare `font`, `font-family`, `font-weight`, `font-size`, `line-height`, or `letter-spacing` in the corresponding CSS Module. Mark one justified declaration with a same-line `dhm-typography-exception` comment.
- Keep component props separate from Figma visual state. Prefer native `disabled`, focus, hover, and active behavior.
- Use `useId` for linked labels and inputs. Preserve keyboard behavior.

## Storybook

- Import the package CSS from `.storybook/preview.ts`.
- Provide one story for every meaningful variant and one composite story for comparison.
- Apply the package's documented mode selector on the story root or `document.documentElement`.
- Make visual review possible without Figma Code Connect running in the browser; mock Code Connect only in Storybook's browser bundle when required.

## Code Connect and Chromatic

- Keep `Component.figma.ts` beside its component and map only real Figma properties.
- Use `FIGMA_ACCESS_TOKEN` for `figma connect publish`; store it as a repository secret for CI.
- Store `CHROMATIC_PROJECT_TOKEN` as a repository secret. Pin the Chromatic action to a reviewed major version rather than `@latest`.
- Build Storybook before publishing to Chromatic. Review visual diffs before releasing the component package.

## Required component-contract metadata

Record at least this information per component:

```json
{
  "component": "Button",
  "figma": {
    "url": "https://www.figma.com/design/<file>/<name>?node-id=<node>",
    "nodeId": "<node>"
  },
  "tokens": {
    "package": "@scope/tokens",
    "version": "1.1.1",
    "sourceCommit": "abc1234"
  },
  "roles": [
    { "element": "root", "role": "background.default", "tokenPath": "color/action/primary/background", "cssVariable": "--color-action-primary-background" },
    { "element": "root", "role": "radius", "tokenPath": "shape/radius/md", "cssVariable": "--shape-radius-md" }
  ],
  "typography": [
    { "element": "input", "className": "dhm-type-body-default" },
    { "element": "helper text", "className": "dhm-type-caption-small" }
  ]
}
```

The values must match `package-lock.json`, the public package manifest, the rendered source, and the Code Connect URL. The manifest's `entries` array is authoritative for `tokenPath` and `cssVariable`. Light/dark color modes do not require typography variants. Record extra typography-mode behavior only when responsive or typography-specific modes are intentionally defined.
