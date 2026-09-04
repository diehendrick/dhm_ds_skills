# Page implementation code-quality contract

Use this contract for every Page Specs implementation. It is intentionally strict because Page Specs must result in code that another front-end developer can navigate, review, and extend without reverse-engineering generated markup.

## Styling is class-based only

Do not use inline styles in JSX, HTML, or JavaScript. This includes `style={...}`, HTML `style="..."`, JavaScript style objects, runtime assignments such as `element.style`, and CSS-in-JS introduced for the page.

Use the target project’s established class-based styling system instead:

- CSS Modules when the project uses CSS Modules;
- colocated or global stylesheet files when that is the project convention; or
- utility classes when the project has an established utility-CSS system.

Do not introduce a second styling architecture. A reusable class, variant class, media query, or project-approved utility is required for every visual state, responsive rule, and design token. Dynamic presentation must be modelled as a named class or a component variant; it must not be computed into an inline `style` prop.

## Token and radius fidelity

For every visual property represented by a Page Spec token binding, use the corresponding project token interface. Do not replace the binding with a resolved literal.

Border radius is a required visual mapping:

- Every non-zero `border-radius` must resolve to the Page Spec’s bound radius token or an existing, documented compatible radius token.
- Do not use a raw pixel, rem, or arbitrary radius value when a token is available.
- `border-radius: 0` is allowed only when the Page Spec explicitly intends a square edge; it is not a substitute for a missing radius token.
- If Page Specs supplies a non-zero resolved radius without a binding and the token source has no compatible radius token, flag a **missing radius token**. Do not invent a token name or silently introduce a literal. Obtain approval before creating a visual exception.
- Apply the same rule to rounded images, cards, controls, pills, focus rings, pseudo-elements, and responsive variants.

The same discipline applies to bound color, spacing, typography, border/stroke, and effect values. Prefer a direct token or approved semantic alias. Never copy a resolved value just because it is shorter to type.

## Maintainable React structure

Keep the page readable from top to bottom:

- A route/page file composes named sections in the visual order of the Page Spec.
- Each significant Page Spec section has one clear entry point, with a name that reflects its content (`HeroSection`, `CustomerLogosSection`, `FooterSection`), not its position or generic node type.
- Extract a project-local component only for a repeated semantic pattern or a meaningful independent unit. Do not create one component per wrapper, text node, or Figma layer.
- Keep one-off markup close to its owning section. Avoid a giant catch-all `components/` directory and avoid anonymous nested render functions.
- Store repeated content as typed data and render it with stable semantic keys. Keep page content separate from layout code when it improves readability.
- Use semantic HTML first: `header`, `nav`, `main`, `section`, headings in order, lists for repeated items, `button` for actions, and links for navigation.
- Type component props and data. Avoid `any`, unexplained boolean switches, duplicated markup branches, deeply nested conditionals, and nested ternaries.
- Preserve existing project conventions for file names, imports, barrel files, tests, and routing. Do not add a dependency merely to solve routine layout or styling.

## Commenting standard

Comments are required for intent and traceability, but must not narrate obvious syntax.

- Add a short file-level comment when a file is generated from, or maps directly to, a Page Spec. Include the Page Spec page or section name.
- Add a short doc comment to every exported page section or inferred reusable component, describing its user-facing purpose.
- Mark each responsive behavior that was inferred because Figma did not provide a matching mobile/tablet spec. State the layout change and its reason.
- Mark an inferred component contract or interaction state as **inferred from Page Specs**.
- In stylesheets, label major Page Spec section blocks and non-obvious responsive groups with concise comments.
- Comment unusual token choices, asset fallbacks, accessibility decisions, or deliberate exceptions near the relevant code.

Do not add redundant comments such as `// render heading` before obvious JSX. The result should explain decisions a developer cannot infer from syntax while keeping the code easy to scan.

## Required review gate

Before handoff, inspect every changed page and styling file against this checklist:

1. No inline-style syntax or runtime style mutation exists in changed implementation files.
2. Every non-zero radius maps to a token, and every missing binding is reported rather than hidden behind a literal.
3. Bound colors, typography, spacing, strokes, effects, and radii are token-backed.
4. The page file reads as ordered sections; repeated patterns are named and typed; one-off markup is not over-abstracted.
5. Required traceability, responsive, and non-obvious-intent comments exist.
6. Long text wraps, narrow screens do not overflow horizontally, and semantic/focus behavior remains usable.
7. The project’s typecheck, lint, tests, and build complete, or failures are reported precisely.

Use targeted text searches appropriate to the project to verify the first gate (for example, search changed TSX/JSX/HTML files for `style=`, `style:`, and `.style`). Then inspect each changed `border-radius` declaration and state its token mapping in the handoff.
