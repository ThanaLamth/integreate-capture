import { describe, expect, it } from "vitest";

import { selectCaptureDefinition } from "../../src/capture/capture-region";
import { loadPlatformConfig } from "../../src/config/loaders";

describe("coingecko capture config", () => {
  it("targets the TradingView live chart container for a coin detail page", async () => {
    const config = await loadPlatformConfig("coingecko");

    const capture = selectCaptureDefinition(config, "coin_detail", "price_chart");

    expect(capture.captureKey).toBe("price_chart");
    expect(capture.strategy).toBe("element");
    expect(capture.selectors[0]).toBe("[data-coin-chart-v2-target='tvLiveChartContainer']");
    expect(capture.fallbackSelectors).toEqual([]);
    expect(capture.cropRules).toBeUndefined();
  });
});
