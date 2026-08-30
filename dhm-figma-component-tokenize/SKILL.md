---
name: dhm-figma-component-tokenize
description: Create or update Figma components so their fills, strokes, effects, spacing, radius, and text use DHM Variables and Text Styles. Use when making a Figma component from scratch or correcting token bindings; not for React implementation alone.
---

# DHM Figma Component Tokenize

Use this skill to keep Figma components token-bound before they are implemented in code.

## Required context

Identify the target Figma file/node, the DHM token workspace or published package/version, and the component's intended states. Inspect the available Figma Variables and Text Styles before editing. If the required semantic token or text composition does not exist, stop and report the missing design-system input; do not create a look-alike local value.

## Binding contract

Bind every applicable visual value to DHM design-system assets:

- fills, strokes, and effect colors use semantic color Variables;
- padding, gaps, border radius, opacity, and numeric effects use DHM Variables when the Figma property supports a binding;
- text layers use the matching DHM Text Style composite, and their fill uses a semantic text-color Variable;
- shadows/effects use the DHM Effect Style or its supported bound values;
- component variants express semantic states such as default, hover, focus, disabled, selected, and error rather than storing detached literal values.

Use primitive tokens only when no semantic token exists; document the exception in the component description or handoff. Never replace a missing semantic token with a local color, number, or text style.

### Geometry exception

Width and height need a design decision before they become token bindings. Bind them only when they are intentionally reusable component dimensions, such as an avatar size or a documented `sm`/`md`/`lg` control size. Do not require bindings for layout-derived geometry: Hug/Auto layout containers, auto-height text, technical wrappers, or vector/icon bounds. Component Specs deliberately do not infer width or height bindings for those cases; preserve an existing Figma Variable binding when one is already present.

## Workflow

Inspect the component and its nested instances first. Map each visual role to a DHM token or Text Style, then make the bindings. Preserve the public component properties and avoid detaching nested DHM components merely to alter a visual value. Create variants only when they represent a real state or API dimension.

After editing, re-inspect the resulting component. Confirm that every mapped property is bound, text layers retain their intended composition, and no literal overrides remain where a binding is supported. Capture the Figma URL/node ID and export the Component Spec for the downstream component-library contract. The spec is the source for component structure, variants, resolved geometry, and token bindings; add only implementation-specific metadata separately.

For a code implementation, hand off to `dhm-design-system-build` with the exact Figma URL/node ID, token package/version, and mappings. This skill does not publish npm packages or create Storybook code.

## Completion report

Report the component URL/node, newly bound or corrected properties, Text Styles applied, exceptions caused by unsupported Figma bindings, and missing tokens that need to be added in DHM Tokens.
