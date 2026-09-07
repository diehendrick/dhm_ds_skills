---
name: dhm-component-spec-to-react-with-component-lab
description: Implement or update React components from DHM Component Spec JSON in a Component Lab workspace, with prop coverage and local Lab QA. Use for Component Lab projects, not ordinary Storybook work.
---

# DHM Component Spec to React with Component Lab

Use DHM Component Spec JSON as the design source of truth and Component Lab as the local review surface. The goal is a reviewable React component without adding Storybook.

Read [the Component Lab contract](references/component-lab-contract.md) before changing a component or Lab configuration.

## Scope

- Apply when the project contains `component-lab.config.json`, or the user explicitly asks to use Component Lab.
- Do not add, migrate to, or configure Storybook under this skill. If the user asks for Storybook, use that project's Storybook workflow instead.
- Keep Component Lab as a local review tool. Do not publish, install external dependencies, or change icon/font providers without the user's authorization or an existing project configuration.

## Workflow

1. Locate the Lab, configured component/spec folders, and the requested DHM Component Spec. If given a Component Specs index, resolve its referenced component file; do not treat the index itself as the spec.
2. Inspect `title`, `props`, `default.elements`, root styles, and every `variants[].configuration`. Before implementation, account for each Figma property and variant in the React API. Report any source property that cannot be represented instead of silently dropping it.
3. Implement the default-exported React component using the filename derived from the spec title. Preserve token references when available and use project-defined font/icon providers. Do not invent controls absent from the spec.
4. Make the rendered root identifiable to the Lab with `data-dhm-element="root"`. Surface reviewable selected props with matching `data-*` attributes (for example `data-variant`, `data-size`, `data-state`).
5. Implement the selected variant/state styling, including the exported root geometry when present. Treat height, padding, corner radius, and border width as explicit verification points because the Lab measures them.
6. Run the structural QA command for the exact spec, then the project's test and build commands. Start the Lab when required and run its browser QA for the component. Fix failures before handoff; explain intentional warnings.
7. Leave the component ready for the user's visual review in the Lab. State clearly that the current Lab's visual comparison is manual, not a pixel-diff approval.

## QA discipline

- A passing CLI structural check validates the Component Spec document; it does not prove the React component is rendered correctly.
- Browser QA validates the registered renderer, DHM root marker, selected props, measurable root CSS, basic accessibility, and token references present in the spec.
- Component states are derived from exported Figma variant configurations. Do not require hover, focus, or pressed states that are absent from the spec.
- Current runtime QA does not independently test browser pointer/keyboard event behavior or prove a CSS token is used in implementation. Treat those as manual review or add project tests when the task requires them.

## Handoff

Report the implemented component, prop/variant coverage, commands run and their result, remaining warnings, and the specific visual review the user should perform. Do not call a component ready to publish if a blocking QA check failed.
