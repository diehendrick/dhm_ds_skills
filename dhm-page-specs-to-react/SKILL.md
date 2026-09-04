---
name: dhm-page-specs-to-react
description: Build or update a responsive React landing page from DHM Page Specs, design tokens, optional Component Specs, and exported assets. Use for page-level implementation when Storybook or a component library may be unnecessary.
---

# DHM Page Specs to React

Implement a responsive landing page from the outputs of DHM Tokens Page Specs. Treat the page specification as the structural handoff, design tokens as the styling source, and Component Specs as optional contracts for reusable components.

This skill is for a page or a small set of page sections. It does not require Storybook, Figma Code Connect, or Chromatic unless the user explicitly chooses a component-library workflow.

## Gather the implementation context

Before editing, identify:

- the target React project, its framework, routing convention, styling approach, and existing component conventions;
- the Page Spec or selected Page Spec sections to implement, including structure, token bindings, resolved values, and asset bindings;
- the available DHM token source: published package, exported CSS/manifest, or the user-provided token workspace;
- exported assets and their intended local paths; and
- any Component Specs that correspond to elements on the selected page.

Default to **page-only** when the user asks to build a landing page and has not requested a component library. Do not ask the user to set up Storybook merely because the page contains buttons, cards, or navigation.

If a required Page Spec, token source, asset, or target project is unavailable, state exactly which input is missing and what can still be implemented. Do not silently recreate tokens or substitute a remote image.

## Source precedence

Use sources in this order for each decision:

1. The selected Page Spec supplies page hierarchy, section/layer purpose, bound token names, asset bindings, and the relevant resolved geometry.
2. The DHM token source supplies actual token values and the project-facing token interface.
3. A matching Component Spec supplies component anatomy, variants, states, and component-specific bindings.
4. Existing project conventions decide routing, code organization, and compatible implementation details.

When a Page Spec has a token binding, use its token name rather than hard-coding the resolved value. A resolved value is a useful fallback or visual-verification reference, not a replacement for an available binding. If no native Figma binding exists, retain the literal only when the Page Spec supplies it; do not invent a token alias.

Read [the code-quality contract](references/code-quality.md) before implementing or reviewing a page. Its requirements apply to every implementation mode, including `page-only`.

## Select an implementation mode

Choose the smallest mode that serves the request:

| Mode | Use when | Deliverable |
| --- | --- | --- |
| `page-only` | The request is one landing page or one-off sections. | Page route and section-local markup; no Storybook requirement. |
| `page-with-components` | Repeated patterns improve maintainability within the same product. | Page plus project-local React components; Storybook remains optional. |
| `component-library` | The user explicitly wants shared, documented, versioned components. | Hand off each reusable component to `dhm-design-system-build`, then compose the page from that library. |

Do not convert every Figma layer into a React component. Choose boundaries as follows:

- A matching Component Spec: implement or use a React component that follows that contract.
- A repeated semantic and structural pattern without a Component Spec: create a small project-local component and mark its contract as **inferred from Page Specs**.
- A single, page-specific group: keep it section-local unless extraction materially improves clarity.
- Text runs, decorative shapes, icons, and simple wrappers: keep them as markup or assets unless they have a real reuse boundary.

When the design shows a button, card, or control without a Figma component or variants, implement accessible native semantics and reasonable interaction states. Mark those states as inferred; never present them as Figma-defined variants.

## Implement assets deliberately

Use the asset path recorded in Page Specs, while adapting it to the target project’s established asset convention. Preserve the exported filename when possible.

- Use the exported raster or SVG asset supplied by the Page Spec.
- Treat an SVG/vector group as one semantic asset when Page Specs has already grouped it; do not recreate its internal paths as separate assets.
- If a local asset is missing, use the Page Spec fallback only when one is supplied or the user has authorized a placeholder. Record the fallback clearly.
- Do not download Unsplash images, add remote hotlinks, or replace a supplied brand asset without the user’s authority.

## Infer responsive behavior responsibly

Implement mobile-first, even if the Page Spec contains only desktop design.

- Respect Figma auto-layout, layout direction, constraints, and content hierarchy where they are represented in Page Specs.
- Let content drive breakpoints. Reflow multi-column grids into fewer columns or a stack before content becomes cramped; do not assume desktop/tablet/mobile breakpoint values are design requirements.
- Prefer fluid widths, max-width containers, intrinsic text wrapping, and token-based spacing. Prevent horizontal scrolling and text clipping.
- Keep essential content and hierarchy intact. Do not invent new page sections, interactions, or visual themes just to fill a mobile view.
- For responsive choices not specified by Figma, record a concise **responsive inference** in the implementation handoff: what changes, at what approximate content breakpoint, and why.

When a mobile or tablet Page Spec exists, it overrides inference for its matching section.

## Build and verify

1. Inspect the target project before changing architecture or adding dependencies.
2. Map Page Spec sections to the route and select the implementation mode.
3. Add or update page sections, inferred local components, and assets using project conventions.
4. Apply bound token names through the project’s token interface. Keep spacing, typography, colors, radii, borders, and effects aligned with available bindings. Follow the no-inline-style and radius rules in the code-quality contract without exceptions.
5. Check desktop and narrow viewport behavior, including long headings, cards, navigation, images, focus states, and no horizontal overflow.
6. Run the project’s relevant typecheck, lint, test, and build commands. Run the contract checks for inline styles, raw radii, and changed-file readability. Do not claim visual parity without a comparison against the supplied Page Spec or Figma source.

Finish with a concise implementation handoff that lists:

- implemented page route and source Page Spec sections;
- token source and bindings used;
- assets used, missing assets, and any authorized fallbacks;
- inferred project-local components and inferred interaction states;
- responsive inferences; and
- verification commands and outcomes, including the inline-style and radius checks.

## Boundaries

Do not use this skill to mutate Figma, regenerate Page Specs, or publish a token package. Do not impose Storybook, Code Connect, Chromatic, or a component library on a page-only implementation.

If the user wants reusable, versioned, documented components across products, use `dhm-design-system-build` for those component contracts. This skill can still compose the resulting components into the landing page.
