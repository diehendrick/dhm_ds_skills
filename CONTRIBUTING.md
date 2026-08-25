# Contributing

Keep each skill self-contained, with a valid `SKILL.md` frontmatter containing its directory-matching `name` and a discriminating `description`.

Before a pull request or release:

1. Run the skill validator for every changed skill.
2. Run `node dhm-design-system-build/tests/check-token-alignment.test.mjs` after changing the build skill or validator.
3. Keep instructions implementation-neutral unless a DHM integration requires a specific tool or artifact.
4. Do not add credentials, personal access tokens, package tokens, screenshots containing secrets, or generated user projects.

Use semantic version tags for releases. Changes that alter a skill's behavior or contract should update the relevant README/reference and include a validation fixture when the behavior can be checked deterministically.
