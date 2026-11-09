# gotirekha-web

Code shared by the Gotirekha web sites (`@gotirekha/web`): the API client and session, the sign-in parts, the theme and fonts, the texts and time formats, the table and the side panel. Only what two sites use goes in.

## Use

```sh
pnpm add github:ifoysalahmmed/gotirekha-web#v0.1.0
```

pnpm builds the package on install (`prepare`), so the installing site has to allow `@gotirekha/web` to run its build script. React, Mantine, React Query, react-router, react-hook-form, zod and `@gotirekha/schemas` are peer dependencies: the site installs them, so there is one copy of each.

At the start of the site:

```ts
import '@gotirekha/web/styles';

configureApi({ site: 'admin', authPath: 'admin/auth' });
setZodTexts();
```

The site makes its `t` with `createTexts(siteMessages)`. Its messages add to the shared ones and can replace any of them.

## Scripts

- `pnpm build`: compile `src/` to `dist/`.
- `pnpm typecheck`: check types without writing files.
- `pnpm lint`: run ESLint.

## Release

1. Pull request, then merge to `main`.
2. Tag `main` with the new version (`git tag v0.2.0`) and push the tag (`git push origin v0.2.0`).
3. Raise the tag in each site, and replace the entry in that site's `pnpm-workspace.yaml` (`allowBuilds`); the install error prints the new one.

While working on the package and a site together, install it in the site from the folder (`pnpm add file:../gotirekha-web`), and go back to the tag before committing the site.
