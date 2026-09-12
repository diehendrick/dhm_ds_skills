---
name: dhm-swiftui-design-system
description: Build or update an iOS SwiftUI app from a DHM Swift Package, design tokens, Component Specs, and Page Specs. Use for token-backed iOS implementation or review; not for publishing a package or editing Figma.
---

# DHM SwiftUI Design System

Implement native SwiftUI interfaces from DHM design-system outputs. The package name, module name, token names, and repository are project-specific: inspect the installed package and its public API rather than assuming any particular generated name.

## Establish the contract

Before changing the app, identify:

- the app target, deployment target, existing architecture, and supported appearance modes;
- the exact Swift Package URL and version or tag selected by the project;
- the package product/module and public token and typography interfaces;
- the relevant Component Spec or Page Spec, if supplied; and
- whether the task is an app implementation, a reusable view, or a package integration check.

Use Xcode's **Add Package Dependencies** flow for a source-based Swift Package. A private repository needs GitHub or SSH credentials available to Xcode; it does not require GitHub Packages or a Package Collection. Do not change package rules, publish a release, or alter repository visibility unless the user explicitly asks.

## Source precedence

Resolve implementation decisions in this order:

1. Component and Page Specs define hierarchy, component anatomy, variants, states, asset bindings, and token bindings.
2. The installed Swift Package defines the usable token values and the public Swift interface.
3. `DESIGN.md` adds intent and terminology for people and AI; it does not override a binding or create a runtime API.
4. Existing app conventions decide navigation, state management, localization, and file organization.

When a spec includes a token binding, use that semantic token through the package API. Treat a resolved literal in a spec as a fallback or visual-reference value only. If there is no binding, retain the supplied literal only when the design contract requires it; do not invent a token alias.

## Implement natively

- Use the package's documented color, spacing, radius, and typography interfaces. Inspect the generated symbols first; do not presume that every package exports `Tokens`, `TextStyles`, or a particular module name.
- Prefer semantic tokens for app UI. Reserve primitive tokens for foundational views, deliberate derivation, or a documented fallback.
- Map typography as a complete contract: font family/weight/size, line-height behavior, tracking, casing, and text decoration when supplied. Do not replace a text style with only a point size.
- Keep Dynamic Type intact. Fixed visual values from a spec must not prevent readable larger accessibility text unless the design explicitly defines a non-scaling treatment.
- Use SwiftUI's semantic controls and labels. Provide VoiceOver labels for icon-only controls, preserve focus affordances, and avoid encoding state solely by color.
- Respect existing dark-mode behavior. Do not turn a semantic color into a hard-coded light or dark literal when the package or app already models appearance variants.
- Treat Component/Page Spec JSON as implementation context, not automatic UI. If the package exposes resource URLs or indexes, load and decode them only when the requested feature needs runtime spec discovery; ordinary views should compile against the token API.

## Choose the smallest useful boundary

- For a one-off screen or section, use project-local SwiftUI views and keep the Page Spec as the structural contract.
- For a repeated design-system element with Component Spec variants, create or update a reusable SwiftUI component with an explicit, token-backed public surface.
- Do not generate a SwiftUI view for every Figma layer. Separate components only where a repeated semantic behavior, variant, or accessibility contract exists.
- If a state, responsive behavior, or interaction is missing from the specs, make the smallest platform-appropriate inference and identify it in the handoff. Do not present it as design-defined.

## Verify

1. Build the target and run relevant tests after integrating the package or changing views.
2. Check a representative screen in light and dark appearance when the app supports both.
3. Check Dynamic Type, longer localized strings, VoiceOver labels, and interactive states for changed controls.
4. Confirm a Component/Page Spec binding resolves to the package token rather than a duplicated literal where that API exists.

Report the package/version used, source specs used, token bindings applied, any intentional inference, and the verification results. Clearly distinguish an integration-ready change from a published package release.

## Boundaries

Do not use this skill to regenerate tokens, mutate Figma, publish to GitHub, or release to a package registry. For those tasks, use the appropriate export or release workflow.
