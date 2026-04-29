# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Status

Freshly scaffolded NestJS 11 project. Despite the repo name `nest-gql`, GraphQL has **not yet been wired in** — there is no `@nestjs/graphql` dependency and no resolvers. The current `AppModule` only exposes the default REST `AppController` / `AppService`. Adding GraphQL is presumably an upcoming task.

This is one service inside the `fiscalia/microservices/` folder.

## Commands

Package manager: **yarn** (a `yarn.lock` is present — do not introduce `package-lock.json`).

```bash
yarn install              # install deps
yarn start:dev            # run in watch mode (default port 3000, override via PORT env)
yarn start:debug          # watch mode with --inspect
yarn start:prod           # run compiled output from dist/
yarn build                # nest build → dist/
yarn lint                 # eslint --fix on src, apps, libs, test
yarn format               # prettier write on src + test
yarn test                 # all unit specs (*.spec.ts under src/)
yarn test:watch
yarn test:cov
yarn test:e2e             # uses test/jest-e2e.json (matches *.e2e-spec.ts under test/)
```

Run a single unit test file: `yarn test src/app.controller.spec.ts`
Run a single test by name: `yarn test -t "should return"`

## Test configuration gotcha

There are **two Jest configs**:

- Unit: inline in `package.json` — `rootDir: src`, matches `*.spec.ts`. Tests outside `src/` are invisible to `yarn test`.
- E2E: `test/jest-e2e.json` — `rootDir: .` (the `test/` dir), matches `*.e2e-spec.ts`.

Place new unit specs alongside their source under `src/`; place HTTP-level tests under `test/` with the `.e2e-spec.ts` suffix.

## TypeScript notes

`tsconfig.json` uses `module: nodenext` + `moduleResolution: nodenext`, so relative imports must be resolvable per Node ESM rules. `strictNullChecks` is on but `noImplicitAny` and `strictBindCallApply` are off — be explicit with types on public APIs even though the compiler won't force it.
