# DHM Design-System Skills

Reusable agent skills for DHM Tokens design systems.

## Skills

- `dhm-figma-component-tokenize`: creates or corrects Figma components using DHM semantic Variables, Effect Styles, and Text Style compositions.
- `dhm-design-system-build`: implements or reviews React components using the released DHM token npm package, Storybook, Figma Code Connect, and Chromatic.

## Intended workflow

1. Author and bind tokens, text styles, and components in DHM Tokens/Figma.
2. Publish a versioned DHM token package.
3. Use the Figma skill to ensure the component has no detached visual values.
4. Use the build skill to implement it from the same package and verify it in Storybook.

The skills use normal automatic discovery. In Codex, install or expose this repository in the skill search path; the agent then selects the relevant skill from the request. Other agent products need an equivalent installation or workspace-loading step—agent skills are not shared automatically across separate applications.

## Package contract

The token package must expose `tokens.css`, `typography.css`, and `manifest.json`. `manifest.json` must have an `entries` array containing `tokenPath` and `cssVariable`; this enables role-to-token validation.

Text compositions normally stay invariant across light/dark modes; color modes do not require typography variants. If users deliberately create responsive or typography-specific modes, document their selector and verification in the component contract.

## Validation

`dhm-design-system-build/scripts/check-token-alignment.mjs` validates typography use, declared role mappings, package-manifest entries, and common hard-coded visual values. Run its fixture check with `node dhm-design-system-build/tests/check-token-alignment.test.mjs`.

## License

This repository is licensed under the MIT License.
