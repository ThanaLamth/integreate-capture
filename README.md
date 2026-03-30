# Local Platform Capture

Local workflow for turning an article draft into a Markdown article with market-data image placeholders generated from site-aware platform capture rules.

## Compared To `integreate-capture`

This repo version extends `https://github.com/ThanaLamth/integreate-capture` with a larger evidence-routing and validation layer.

Main improvements:

- article-aware platform recommendation instead of only fixed asset-to-platform mapping
- draft planning with:
  - `Required Evidence`
  - `Visual Needs`
  - `Capture Plan`
  - `Data Notes`
- broader evidence types such as:
  - `macro_rates`
  - `commodities_fx`
  - `etf_flow`
  - `structured_product`
  - `options_market`
  - `exchange_positioning`
- platform health checks and selector-level capture checks
- page validation before capture, so blocked pages and useless shells are rejected
- generic popup dismissal plus site-specific prep hooks
- persistent browser-profile support for challenge-heavy sites
- source-family suggestions and onboarding scaffolds for new platforms
- per-site caption profiles for 13 sites
- capture context extraction with short data notes

In short, the original repo was mostly a capture module. This version is closer to an article-evidence capture engine.

## What This Repo Does

- Reads a local draft article file
- Detects asset mentions from the title and body
- Uses site-specific platform priority from `site_platform_fit_sorted_by_site_2026-03-25.csv`
- Resolves asset URLs through config
- Applies platform-specific capture rules and site-specific page prep
- Produces Markdown output with inserted image references
- Writes screenshot metadata and logs locally

## Current Scope

- Local files only
- No WordPress integration in this repo
- Designed to be called by a separate article-writing flow
- Uses Playwright-based browser capture
- Supports per-platform selectors, crop fallbacks, and pre-capture interactions

## Supported Workflow

This repo is best treated as a small capture module for another machine or another article bot.

The caller provides:

- `platformKey`
- `url`
- `captureKey`
- `outputPath`

The capture layer returns:

- `outputPath`
- `selectorUsed`
- `mode`

## Install

```bash
npm install
npx playwright install
```

## Build And Test

```bash
npm run build
npm test
```

## Run The Article Flow

Dry run:

```bash
npm run build
node dist/src/cli/main.js --article "draft article.txt" --site bitcoininfonews --dry-run
```

Live run:

```bash
npm run build
node dist/src/cli/main.js --article "draft article.txt" --site coincu
```

## Run A Direct Image Capture

This is the recommended path for another PC that only needs screenshots and does not need the article-routing flow.

Direct CLI call:

```bash
npm run build
node dist/src/cli/main.js --platform coingecko --url "https://www.coingecko.com/en/coins/bitcoin" --capture price_chart --output "C:\captures\bitcoin.png"
```

Recommend the best platform(s) for an article:

```bash
npm run build
node dist/src/cli/main.js \
  --recommend-title "Gold Falls as Real Yields Rise and Dollar Strengthens" \
  --recommend-url "https://coincu.com/markets/gold-falls-as-real-yields-rise-dollar-strengthens/"
```

Check which configured platforms are healthy, blocked, or broken:

```bash
npm run build
node dist/src/cli/main.js --check-platform-health
```

Check one platform only:

```bash
node dist/src/cli/main.js --check-platform-health --health-platform coingecko
```

Plan a draft before final capture/output:

```bash
npm run build
node dist/src/cli/main.js --plan-draft --article "draft article.txt" --site bitcoininfonews
```

This returns a draft workflow plan with:

- extracted asset matches
- required evidence blocks for the writer
- suggested platforms for each evidence block
- writing instructions before image insertion
- claim-anchored capture plans
- current platform recommendations
- suggested new platforms when current coverage is weak
- markdown with capture placeholders and `Data Notes`

Onboard a newly recommended platform into the repo:

```bash
npm run build
node dist/src/cli/main.js \
  --onboard-platform etherscan \
  --onboard-sample-url "https://etherscan.io/address/0x0000000000000000000000000000000000000000" \
  --onboard-evidence onchain_transfer
```

This scaffolds:

- `configs/platforms/<platform>.json`
- a current-platform entry in `platform-catalog.json`
- a sample target in `platform-health-targets.json`

Persistent profile flow for Cloudflare-protected sites:

```bash
npm run build
node dist/src/cli/main.js --url "https://www.coingecko.com/en/coins/ethereum" --profile-dir "./.profiles/coingecko" --warmup
```

Solve the verification in the opened browser, then close it with `Ctrl+C`. Reuse the same profile for captures:

```bash
node dist/src/cli/main.js --platform coingecko --url "https://www.coingecko.com/en/coins/ethereum" --capture price_chart --output "./output/images/ethereum-coingecko.png" --profile-dir "./.profiles/coingecko"
```

PowerShell wrapper:

```powershell
.\capture-image.ps1 -PlatformKey coingecko -Url "https://www.coingecko.com/en/coins/bitcoin" -CaptureKey price_chart -OutputPath "C:\captures\bitcoin.png"
```

If a site works better in headed mode on that machine, add:

```powershell
-Headed
```

## Programmatic Capture Example

```js
const { executeCapture } = require("./dist/src/capture/execute-capture.js");

const result = await executeCapture({
  platformKey: "coingecko",
  url: "https://www.coingecko.com/en/coins/bitcoin",
  captureKey: "price_chart",
  outputPath: "./output/images/bitcoin-coingecko.png"
});

console.log(result);
```

## Output Layout

- `output/images/`
- `output/metadata/`
- `output/articles/`
- `output/logs/`

## Config Layout

- `configs/platforms/*.json`
- `configs/assets/asset-map.json`
- `configs/site-priority.json`

## Platform Status Notes

Machine-readable platform access notes are in:

- `docs/platform-access-status-2026-03-26.csv`

This file records whether a platform currently works from this VPS, is login-gated, or is blocked by Cloudflare/captcha.

Broader design notes and capture observations are in:

- `docs/superpowers/specs/2026-03-25-local-platform-capture-design.md`

## GitHub Export

Recommended structure:

- create a dedicated GitHub repo for this project
- push source, configs, tests, and docs
- do not push generated output, browser state, or local-only artifacts

This repo is prepared to exclude:

- `node_modules/`
- `dist/`
- `output/`
- Playwright reports and test artifacts
- local env files

## Typical Setup On Another PC

```bash
git clone <YOUR_GITHUB_REPO_URL>
cd integrate-data-image
npm install
npx playwright install
npm run build
npm test
```

Then integrate it into the article-writing machine by either:

1. calling the CLI
2. importing `executeCapture(...)` from `dist/src/capture/execute-capture.js`

For the simplest external integration, prefer the direct capture wrapper:

```powershell
.\capture-image.ps1 -PlatformKey <platform> -Url "<page-url>" -CaptureKey <capture-key> -OutputPath "<target-image-path>"
```

## Suggested GitHub Commands

Initialize locally:

```bash
git init
git add .
git commit -m "Initial local platform capture export"
```

Attach GitHub remote and push:

```bash
git remote add origin <YOUR_GITHUB_REPO_URL>
git branch -M main
git push -u origin main
```

## Notes For The Other PC

- Some platforms are fully usable from this VPS and should transfer cleanly
- Some platforms are blocked by Cloudflare and may still require a captcha solver or a manual-assisted browser session
- Some platforms may require login for deeper pages even if one public page already works

Always check `docs/platform-access-status-2026-03-26.csv` before wiring a platform into unattended article export.
