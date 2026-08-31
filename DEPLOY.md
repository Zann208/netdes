# Deploying NETDES to GitHub Pages

Target: **https://zann208.github.io/netdes/**

## Publish an update

```bash
node scripts/validate.mjs
git diff --check
git add .
git commit -m "Update NETDES study console"
git push origin main
```

GitHub Pages serves the repository root from the `main` branch. The validation workflow runs automatically for pushes and pull requests that change the console, adapter, documentation, or validator.

## Pages configuration

Repository **Settings → Pages**:

- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **/ (root)**

After the push, confirm the workflow succeeds and then verify the live console at the target URL.
