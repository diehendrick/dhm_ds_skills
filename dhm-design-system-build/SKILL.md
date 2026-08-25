---
name: dhm-design-system-build
description: Build or update a React component library from Figma components using a versioned DHM design-token npm package, Storybook, Figma Code Connect, and Chromatic. Use when implementing or reviewing a component library that must consume DHM semantic tokens and text compositions; not for binding a Figma component to Variables.
---

# DHM Design System Build

Use this skill to build component-library code that is visually aligned with Figma and technically aligned with a released DHM token package.

## Source-of-truth contract

Keep the responsibilities separate:

```text
DHM plugin workspace -> GitHub token repository -> versioned token npm package
Figma component -> component API and visual intent
Component-library repository -> React implementation, Storybook, Code Connect, Chromatic
```

The token package is the only styling-value source for the component library. Do not regenerate, copy, or manually maintain a second token set from Figma in `src/index.css`, Tailwind configuration, or `design-system/figma-variables.json`.

Figma remains the source for component structure, variants, properties, and visual review. It is not the package's token source.

## Required inputs

Before creating or changing a component, identify:

- token package name and exact published version;
- Figma component URL and node ID;
- component-library framework and styling adapter;
- target component name and intended public API;
- whether the release should publish Code Connect and/or Chromatic.

For a missing or unpublished token package, stop and ask for a published version. Never use a local token copy as a silent substitute.

## 1. Prepare the component library

For a new library, bootstrap only the framework, package build, Storybook, Code Connect, and Chromatic. Do not bootstrap tokens from Figma.

For the React + CSS Modules adapter, add the token package as a direct dependency and import its generated styles once from the public library entry point or Storybook preview:

```ts
import '@scope/tokens/tokens.css';
import '@scope/tokens/typography.css';
```

Replace `@scope/tokens` with the actual package name. Use the package's documented CSS custom-property names and typography utilities exactly; do not invent aliases.

Read the public `manifest.json` export and package README when mapping CSS. Record the token package name, resolved version, Figma URL, node ID, source commit, typography mapping, and every visual role-to-token mapping in `design-system/component-contract.json`.

Read [references/react-storybook-chromatic.md](references/react-storybook-chromatic.md) before bootstrapping or modifying a React + CSS Modules project.

## 2. Inspect and map the Figma component

Use Figma MCP tools to inspect the selected component and, when possible, capture a screenshot.

Extract:

- component set name, Figma URL, and node ID;
- variant, boolean, text, instance-swap, and numeric properties;
- default values and component states;
- semantic styling roles for color, spacing, sizing, radius, typography, elevation, and motion;
- accessibility requirements implicit in the component.

Map Figma properties to an explicit, typed public React API. Do not expose a React prop merely because it exists internally, and do not fabricate Figma property mappings for Code Connect.

Map every visual styling role to a token declared by the installed package. Prefer semantic tokens; use a primitive only where the package has no semantic equivalent and record why. If a necessary semantic token does not exist, stop and report the missing token; do not add a hard-coded replacement.

Typography compositions normally remain invariant across light/dark modes. Do not require a theme-specific text style merely because color tokens have modes. Only when the workspace explicitly defines responsive or typography-specific modes must the component contract record how those compositions are selected and verified.

For every text-bearing element, map the Figma Text Style composite to one generated class from `typography.css`. Record the mapping in the component contract, for example: input and suffix -> `dhm-type-body-default`; floating label -> `dhm-type-body-tiny`; helper text -> `dhm-type-caption-small`.

## 3. Build the component

For every component, create:

```text
src/components/<Component>/
  <Component>.tsx
  <Component>.module.css
  <Component>.stories.tsx
  <Component>.figma.ts
  index.ts
```

Use native semantic HTML, typed exported props, accessible labels and focus states, CSS Modules, and explicit variant class maps. Keep layout, color, border, spacing, and state styling in CSS Modules. Apply generated typography classes in TSX to every text-bearing element that has a mapped Figma Text Style.

Do not set `font`, `font-family`, `font-weight`, `font-size`, `line-height`, or `letter-spacing` in that component's CSS Module when a generated text-style class exists. A documented `dhm-typography-exception` is required for the rare case with no matching composite.

Use the selected icon system only when Figma specifies an icon slot. Do not assume Material icons, a font family, Tailwind, or a design-token naming convention.

Update the root barrel export and component-contract metadata in the same change.

## 4. Add Storybook and Code Connect

Create stories for each meaningful variant, size, interaction state, and theme/mode supported by the installed token package. Storybook must import the same token package CSS as the published component library.

Set the Storybook theme/mode control using the package's documented mode selector. Do not create a local dark-mode token set.

Create a `.figma.ts` Code Connect mapping using the exact Figma URL. Map only Figma properties that correspond to public React props. Keep the mapping next to the implementation.

## 5. Validate alignment

Run the repository's typecheck and Storybook build. Then verify:

- package lock resolves the intended token version;
- every referenced token exists in the installed package manifest/CSS;
- no duplicate token declarations shadow the package;
- Storybook renders each supported mode and key state;
- visual output is compared against the Figma component;
- Code Connect URL and property names are exact.

Run the alignment check when the adapter script is available:

```bash
node <skill>/scripts/check-token-alignment.mjs \
  node_modules/@scope/tokens/typography.css \
  node_modules/@scope/tokens/manifest.json \
  src design-system/component-contract.json
```

Treat a missing token, an invented token name, a missing required text-style class, a duplicated typography declaration, or unexplained hard-coded color/spacing/radius/shadow/typography value as a token-drift issue. A `dhm-*-exception` comment must sit on the same line as its one justified declaration; it never exempts an entire file.

If the Figma component itself is unbound or its text does not use DHM Text Styles, hand the task to `dhm-figma-component-tokenize` before implementing code. This skill cannot create those Figma bindings from the component-library repository alone.

## 6. Publish safely

Publish in this order:

```text
release token package
  -> update and lock token dependency in component library
  -> typecheck + Storybook build + visual review
  -> Chromatic review
  -> publish Code Connect
  -> release component-library package
```

Store `FIGMA_ACCESS_TOKEN` and `CHROMATIC_PROJECT_TOKEN` only as GitHub repository secrets or local uncommitted environment variables. Never place either in source, documentation examples with real values, or npm packages.

Use Chromatic changes as a review gate according to the team's policy. `exitZeroOnChanges: true` allows intentional visual changes to continue but does not enforce approval; do not use it when the team requires a blocking gate.

## Completion report

Report the token package/version, Figma component URL, created or changed component files, validation results, Chromatic/Code Connect status, and any unresolved token or visual mismatch.
