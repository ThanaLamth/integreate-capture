# Capture-Image Functions

This document summarizes what `capture-image` can do in `integrate-capture-v2`.

## Core Capture

- Directly capture a chart, table, or data block from a supported platform.
- Save the result to `output/images/` or another specified output path.
- Use platform-specific capture keys such as `primary_view`, `price_chart`, or similar configured targets.

Example:

```bash
node dist/src/cli/main.js \
  --platform tradingview \
  --url "https://www.tradingview.com/chart/?symbol=BITSTAMP%3ABTCUSD" \
  --capture primary_view \
  --output "./output/images/btc.png"
```

## Platform Prep

- Runs a generic popup and consent dismiss pass.
- Runs site-specific prep where needed.
- Restores scrolling and removes obvious overlays when possible.

Examples:

- Yahoo Finance consent handling
- TradingEconomics popup dismissal
- generic modal and cookie handling

## Pre-Capture Validation

- Checks whether the page contains a real chart or meaningful data block before saving a screenshot.
- Rejects blocked pages, shell pages, and low-value generic page captures.
- Prevents false positives from selectors like `body` when they do not represent the real evidence area.

## Platform Health Checks

- Tests whether a platform is reachable.
- Marks platforms as:
  - `healthy`
  - `blocked`
  - `broken`
  - `unknown`
- Stores health results for later routing decisions.

Example:

```bash
node dist/src/cli/main.js --check-platform-health
node dist/src/cli/main.js --check-platform-health --health-platform tradingview
```

## Selector-Level Capture Checks

- Tests whether the configured selector for a platform is actually capture-ready.
- Distinguishes between:
  - page reachable but not usable
  - page reachable and capture-ready

## Article-Aware Recommendation

- Reads article title, URL, and optional body text.
- Recommends the best platforms or source families for the article.
- Uses evidence-type classification rather than only asset matching.

Example:

```bash
node dist/src/cli/main.js \
  --recommend-title "Bitcoin long positions on Bitfinex highest since November 2023" \
  --recommend-url "https://aicryptocore.com/bitcoin-long-positions-bitfinex-highest-since-november-2023/"
```

## Evidence Classification

The system can classify many article/evidence types, including:

- `spot_market`
- `derivatives_market`
- `options_market`
- `exchange_positioning`
- `macro_rates`
- `commodities_fx`
- `etf_flow`
- `filing_regulatory`
- `structured_product`
- `policy_regulatory`
- `claim_check`
- `onchain_transfer`

This lets routing choose evidence sources that match the claim, not just the asset ticker.

## Subject-Aware Routing

- Routes by actual subject when possible.
- Avoids BTC-first fallback when the article is really about:
  - oil
  - gold
  - jobless claims
  - ETF flows
  - Bitfinex longs
  - sovereign reserves

## Draft Planning

- Reads a local draft and outputs a structured evidence plan.
- Produces:
  - `Required Evidence`
  - `Visual Needs`
  - `Capture Plan`
  - `Data Notes`

Example:

```bash
node dist/src/cli/main.js --plan-draft --article "/path/to/draft.html" --site coincu
```

## Article Processing

- Processes a draft into Markdown with image insertion support.
- Can run as a dry run or generate live output.

Examples:

```bash
node dist/src/cli/main.js --article "/path/to/draft.html" --site coincu --dry-run
node dist/src/cli/main.js --article "/path/to/draft.html" --site coincu
```

## Caption Generation

- Generates short, source-linked captions for captures.
- Uses per-site caption profiles for the supported site portfolio.
- Keeps captions short and source-led.

## Context Extraction

- Extracts limited page context from the source page.
- Stores supporting details such as:
  - page title
  - key labels
  - short data lines
  - numeric snippets when available

This helps connect the image back to the news claim.

## Source-Link and Context Sidecars

- A capture can be paired with:
  - image file
  - caption text
  - source URL
  - context note
- Useful for article insertion and downstream editorial workflows.

## New Platform Onboarding

- Scaffolds a new platform configuration.
- Adds the platform into the catalog.
- Adds a sample health target.
- Supports evidence tags during onboarding.

Example:

```bash
node dist/src/cli/main.js \
  --onboard-platform deribit \
  --onboard-sample-url "https://www.deribit.com/statistics/BTC/metrics/options" \
  --onboard-evidence options_market
```

## Persistent Profile Warmup

- Opens a headed browser with a saved profile directory.
- Useful for sites that need a reusable browser session.

Example:

```bash
node dist/src/cli/main.js \
  --url "https://www.coingecko.com/en/coins/bitcoin" \
  --profile-dir "./.profiles/coingecko" \
  --warmup
```

## QC-Driven Capture Input

- Can consume visual requests from an external QC workflow.
- Suitable for inputs like:
  - missing visual
  - wrong visual
  - needs comparison
  - needs reserve proof
  - needs ETF flow chart

This matches the intended split:

- external `writing-qc` decides what visual is needed
- `capture-image` finds and executes the best source path

## Output Types

Common outputs include:

- `output/images/*.png`
- `output/combined-demo/*.png`
- `output/combined-demo/*.txt`
- generated markdown files
- metadata and logs

## Current Limits

- Some sites still block browser automation.
- Some sources are better treated as `link-only` evidence instead of screenshots.
- Captchas and Cloudflare may require a local GUI/profile flow on another machine.
- Context extraction is useful but still limited by what the page exposes in text.

## Practical Summary

`capture-image` is now an evidence-routing and screenshot workflow, not just a screenshot script.

It can:

- decide what source fits a claim
- validate whether the source is actually usable
- capture the right region
- generate caption and source context
- support draft/article workflows
- support external QC-driven image requests
