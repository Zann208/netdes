# Deploying to GitHub Pages

Target URL: **https://zann208.github.io/netdes/**

## One-time setup

```bash
cd netdes
git init
git add .
git commit -m "NETDES: offline study console for CPE434 network design"
git branch -M main
git remote add origin https://github.com/Zann208/netdes.git
git push -u origin main
```

Create the repo first at https://github.com/new — name it `netdes`, public, and do
**not** add a README/license (this folder already has them).

## Turn on Pages

Repo → **Settings** → **Pages** → Source: **Deploy from a branch** →
Branch: `main`, folder: `/ (root)` → **Save**.

Live in about a minute at `https://zann208.github.io/netdes/`.

## Updating later

```bash
git add .
git commit -m "describe the change"
git push
```

## Add it to your portfolio

In the `work` section of the portfolio repo, this now qualifies for a genuine
`live` badge — link to https://zann208.github.io/netdes/
