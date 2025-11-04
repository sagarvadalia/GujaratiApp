# Gujarati Monorepo

## Local Tooling

- `pnpm lint` – runs ESLint across `frontend` and `server` with the shared React Native-aware ruleset.
- `pnpm lint:fix` – fixes autofixable lint issues everywhere.
- `pnpm typecheck` – executes the sequential type-check helper for all packages.

## Package-Specific Commands

- `pnpm --filter frontend run lint` / `pnpm --filter frontend run typecheck`
- `pnpm --filter server run lint` / `pnpm --filter server run typecheck`

## Notes

- Install workspace dependencies from the repo root with `pnpm install`.
- The ESLint config lives in `eslint.base.js` and is composed in each package via their `eslint.config.js` files.
