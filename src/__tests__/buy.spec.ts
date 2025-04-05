import { expect } from "chai";
import BN from "bn.js";
import { buyBaseInputInternal } from "../sdk/buy";

describe("buyBaseInput with fees", () => {
  it("should compute quote + fees + slippage correctly", () => {
    // Example pool reserves
    const baseReserve = new BN(1_000_000);
    const quoteReserve = new BN(2_000_000);

    // Request to buy 10,000 base tokens
    const base = new BN(10_000);

    // Slippage = 1% (slippage=1 => 1%)
    const slippage = 1;

    // Fees (example):
    //   LP fee = 30 basis points (0.30%)
    //   Protocol fee = 20 basis points (0.20%)
    const lpFeeBps = new BN(30);
    const protocolFeeBps = new BN(20);

    const result = buyBaseInputInternal(
      base,
      slippage,
      baseReserve,
      quoteReserve,
      lpFeeBps,
      protocolFeeBps,
    );

    console.log("quote =", result.uiQuote.toString());
    console.log("maxQuote =", result.maxQuote.toString());

    // You can calculate offline and replace these with your
    // actual expected values:
    const expectedQuote = new BN(20305); // Example only
    const expectedMaxQuote = new BN(20508); // Example only

    expect(result.uiQuote.toString()).eq(expectedQuote.toString());
    expect(result.maxQuote.toString()).eq(expectedMaxQuote.toString());
  });

  it("should fail if base > baseReserve", () => {
    const baseReserve = new BN(1_000_000);
    const quoteReserve = new BN(2_000_000);
    const base = new BN(2_000_000); // more than pool
    const slippage = 1;
    const lpFeeBps = new BN(30);
    const protocolFeeBps = new BN(20);

    expect(() =>
      buyBaseInputInternal(
        base,
        slippage,
        baseReserve,
        quoteReserve,
        lpFeeBps,
        protocolFeeBps,
      ),
    ).to.throw("Cannot buy more base tokens than the pool reserves.");
  });
});
