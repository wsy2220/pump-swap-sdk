import { expect } from "chai";
import BN from "bn.js";
import { sellBaseInputInternal } from "../sdk/sell";

describe("sellBaseInput", () => {
  it("should compute final quote and minQuote correctly with typical inputs", () => {
    // Example pool reserves
    const baseReserve = new BN(1_000_000); // base tokens in pool
    const quoteReserve = new BN(2_000_000); // quote tokens in pool

    // The user wants to sell 50,000 base tokens
    const base = new BN(50_000);

    // Slippage = 1% => the user will accept at least 99% of finalQuote
    const slippage = 1;

    // Fees (in BPS)
    // e.g. 30 => 0.30%, 20 => 0.20%
    const lpFeeBps = new BN(30);
    const protocolFeeBps = new BN(20);

    const result = sellBaseInputInternal(
      base,
      slippage,
      baseReserve,
      quoteReserve,
      lpFeeBps,
      protocolFeeBps,
    );

    console.log("Final quote received:", result.uiQuote.toString());
    console.log("Min quote after slippage:", result.minQuote.toString());

    // Replace these placeholder values with the actual results once you confirm them offline:
    // For example, if you do the math manually or from a reference, set them here:
    const expectedFinalQuote = new BN(94761); // Example placeholder
    const expectedMinQuote = new BN(93813); // Example placeholder

    expect(result.uiQuote.toString()).to.equal(
      expectedFinalQuote.toString(),
      "Incorrect final quote",
    );
    expect(result.minQuote.toString()).to.equal(
      expectedMinQuote.toString(),
      "Incorrect min quote",
    );
  });

  it("should throw an error if 'base' is zero", () => {
    const base = new BN(0);
    const baseReserve = new BN(1_000_000);
    const quoteReserve = new BN(2_000_000);
    const slippage = 1;
    const lpFeeBps = new BN(30);
    const protocolFeeBps = new BN(20);

    expect(() =>
      sellBaseInputInternal(
        base,
        slippage,
        baseReserve,
        quoteReserve,
        lpFeeBps,
        protocolFeeBps,
      ),
    ).to.throw("Invalid input: 'base' (base_amount_in) cannot be zero.");
  });

  it("should throw an error if 'baseReserve' or 'quoteReserve' is zero", () => {
    const slippage = 1;
    const lpFeeBps = new BN(30);
    const protocolFeeBps = new BN(20);

    // baseReserve = 0
    expect(() =>
      sellBaseInputInternal(
        new BN(1000),
        slippage,
        new BN(0),
        new BN(2_000_000),
        lpFeeBps,
        protocolFeeBps,
      ),
    ).to.throw(
      "Invalid input: 'baseReserve' or 'quoteReserve' cannot be zero.",
    );

    // quoteReserve = 0
    expect(() =>
      sellBaseInputInternal(
        new BN(1000),
        slippage,
        new BN(1_000_000),
        new BN(0),
        lpFeeBps,
        protocolFeeBps,
      ),
    ).to.throw(
      "Invalid input: 'baseReserve' or 'quoteReserve' cannot be zero.",
    );
  });

  it("should throw an error if lpFeeBps or protocolFeeBps is negative", () => {
    const base = new BN(10_000);
    const baseReserve = new BN(1_000_000);
    const quoteReserve = new BN(2_000_000);
    const slippage = 1;

    expect(() =>
      sellBaseInputInternal(
        base,
        slippage,
        baseReserve,
        quoteReserve,
        new BN(-1),
        new BN(20),
      ),
    ).to.throw("Fee basis points cannot be negative.");

    expect(() =>
      sellBaseInputInternal(
        base,
        slippage,
        baseReserve,
        quoteReserve,
        new BN(30),
        new BN(-5),
      ),
    ).to.throw("Fee basis points cannot be negative.");
  });

  it("should throw an error if fees exceed total output (finalQuote negative)", () => {
    // We want quoteAmountOut > 0 but finalQuote < 0 after subtracting fees.
    const base = new BN(1);
    const baseReserve = new BN(1);
    const quoteReserve = new BN(2);
    const slippage = 1;

    // Large fees (90% + 20% = 110% total) will exceed quoteAmountOut=1
    const lpFeeBps = new BN(9000); // 90%
    const protocolFeeBps = new BN(2000); // 20%

    expect(() =>
      sellBaseInputInternal(
        base,
        slippage,
        baseReserve,
        quoteReserve,
        lpFeeBps,
        protocolFeeBps,
      ),
    ).to.throw("Fees exceed total output; final quote is negative.");
  });
});
