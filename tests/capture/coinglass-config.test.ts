import { describe, expect, it } from "vitest";

import { loadPlatformConfig } from "../../src/config/loaders";

describe("coinglass platform config", () => {
  it("defines explicit first-chart captures for the supported CoinGlass pages", async () => {
    const config = await loadPlatformConfig("coinglass");

    expect(config.platformKey).toBe("coinglass");
    expect(config.matchRules).toHaveLength(5);
    expect(config.captures.map((entry) => entry.captureKey)).toEqual([
      "liquidations_chart",
      "etf_chart",
      "long_short_ratio_chart",
      "market_cap_heatmap",
      "spot_inflow_outflow_chart"
    ]);
    expect(
      config.captures.find((entry) => entry.captureKey === "liquidations_chart")?.selectors
    ).toContain("div.echarts-for-react");
    expect(
      config.captures.find((entry) => entry.captureKey === "liquidations_chart")?.strategy
    ).toBe("element");
    expect(
      config.captures.find((entry) => entry.captureKey === "etf_chart")?.strategy
    ).toBe("element");
    expect(
      config.captures.find((entry) => entry.captureKey === "market_cap_heatmap")?.selectors
    ).toContain("#cg-treemap");
  });
});
