# Publishing

This extension is published by the GitHub Actions workflow in
`.github/workflows/publish.yml`. It runs when you **publish a GitHub Release**
(or trigger it manually from the Actions tab) and pushes to two registries
independently. Each registry is skipped automatically if its token secret is
not configured, so you can enable one without the other.

The published version is whatever is in `package.json` (`"version"`). Bump it
before each release — registries reject re-publishing an existing version.

## Release flow

1. Bump `"version"` in `package.json` and merge to `master`.
2. On GitHub: **Releases → Draft a new release**, create a tag like `v1.2.0`,
   add notes, **Publish release**.
3. The workflow builds/lints/packages the `.vsix`, then publishes to whichever
   registries have tokens set. Watch it under the **Actions** tab.

## Open VSX (open-vsx.org) — GitHub login, no Azure

Used by VSCodium, Cursor, Gitpod, and Eclipse Theia.

1. Sign in at https://open-vsx.org with GitHub.
2. Sign the **Open VSX Publisher Agreement** (one-time; required before you can
   publish): user menu → **Settings → Publisher Agreement**.
3. Create an **Access Token**: **Settings → Access Tokens → Generate New Token**.
4. Create the namespace once (must match `"publisher"` in `package.json`):
   ```bash
   npx ovsx create-namespace the91end -p <your-open-vsx-token>
   ```
5. Add the token to GitHub: repo **Settings → Secrets and variables → Actions
   → New repository secret**, name `OVSX_PAT`.

## VS Code Marketplace (marketplace.visualstudio.com) — needs Azure DevOps PAT

1. Register the publisher `the91end` at
   https://marketplace.visualstudio.com/manage (must match `package.json`).
2. Create a Personal Access Token at https://dev.azure.com (free; no Azure
   subscription needed): **User settings → Personal access tokens → New Token**,
   Organization = **All accessible organizations**, Scope = **Marketplace →
   Manage**.
3. Add it to GitHub as the secret `VSCE_PAT`.

## Local install / testing

```bash
npm install
npx @vscode/vsce package               # produces a .vsix
code --install-extension *.vsix        # install into your VS Code
```

Or press **F5** in VS Code to run it in an Extension Development Host.
