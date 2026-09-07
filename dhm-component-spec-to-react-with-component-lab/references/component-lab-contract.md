# Current Component Lab contract

This reference reflects the Component Lab implementation at `E:\AI project exploration\component_lab`. Re-check the local Lab README and `AI_GUIDE.md` if that implementation changes.

## Source discovery

`component-lab.config.json` is relative to the Lab directory:

```json
{
  "componentsDir": "../components",
  "specsDir": "../specs"
}
```

The Vite adapter recursively discovers component modules (`.jsx`, `.tsx`, `.js`, `.ts`) and Component Spec JSON files in those directories. It matches a default-exported renderer to the spec title or id after normalizing names. A missing renderer is a runtime QA failure.

The Lab accepts a single Component Spec JSON or an aggregate object with a `components` object. A `dhm-component-specs` index has file metadata only: resolve the entries it lists before checking or rendering a component.

## Component implementation contract

- Default export one React component; derive its filename from the Component Spec title in PascalCase.
- Put `data-dhm-element="root"` on its rendered root.
- Expose selected review props as `data-*` attributes on that root. The Lab checks only props whose matching dataset property exists, so keep names consistent. Examples: `data-variant`, `data-size`, `data-state`.
- Derive React controls from `props` plus `variants[].configuration`; variants may only contain deltas from `default`.
- Root styles that are currently measured are `height`, `padding` (left side), `cornerRadius`, and `strokeWeight` (top border). The tolerance is 0.5px.

## Commands

From the Component Lab directory:

```bash
npm run lab:check -- --spec <path-to-component.json> --pretty
npm test
npm run build
```

The CLI returns JSON with `format: "component-lab-qa"` and exits non-zero only for a blocking structural failure. It reports warnings for conditions such as missing token references in a resolved/free spec.

In the running Lab, select the component and controls, then choose **Run QA**. The browser result covers renderer registration, DHM root anatomy, selected props, measured CSS, basic accessibility (semantic root/role and accessible name), and a token reference in the spec.

## Review boundary

The Lab is intentionally not Storybook and does not currently have screenshot pixel-diff baselines. Its measurement overlay and Specs tab support manual visual comparison. Do not describe its QA as proof of interaction-event behavior, pixel-perfect fidelity, or actual CSS token consumption unless project-specific tests supply that evidence.
