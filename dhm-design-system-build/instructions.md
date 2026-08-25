# DHM Design System Build

Use `SKILL.md` as the canonical instruction set for this skill.

For environments that load `.factory` skills through `instructions.md`, follow these non-negotiable rules:

1. Consume a released, exact-version DHM token npm package. Never reconstruct or copy tokens from Figma into a local CSS, Tailwind, or JSON token source.
2. Use Figma only for component structure, properties, variants, accessibility intent, and visual comparison.
3. Build each React component with its implementation, CSS Module, Storybook stories, Code Connect mapping, and public export.
4. Import the same package `tokens.css` and `typography.css` in the public component entry and Storybook preview.
5. Apply a generated `.dhm-type-*` class to each text-bearing element that maps to a Figma Text Style; do not duplicate its font declarations in the CSS Module.
6. Record and validate every visual role-to-token mapping, text-style mappings, lockfile version, typecheck, Storybook build, visual alignment, and exact Code Connect property mappings before release.
7. Release in this order: token package, component-library dependency update, validation and Chromatic review, Code Connect publish, component-library release.
8. Keep Figma and Chromatic tokens in repository secrets or uncommitted local environment variables only.

Read `references/react-storybook-chromatic.md` for the React + CSS Modules adapter and component-contract metadata.
