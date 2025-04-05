# Pump Swap SDK

The SDK is structured as follows:

- `PumpAmmSdk` is the high level SDK, useful for UI integrations.
- `PumpAmmInternalSdk` is the low level SDK, useful for programmatic integrations, allowing full customization of instructions.
- `PumpAmmAdminSdk` is the SDK which allows access to admin-protected instructions.

## Installation

```bash
npm install @pump-fun/pump-swap-sdk
```

## Usage

```typescript
import { PumpAmmSdk, Direction, Pool } from "@pump/swap-sdk";
// or
import PumpAmmSdk from "@pump/swap-sdk";

// Initialize SDK
const pumpAmmSdk = new PumpAmmSdk();
```

## Create pool

```typescript
// Create a (base, quote) pool
const createPoolInstructions = await pumpAmmSdk.createPoolInstructions(
  index,
  creator,
  baseMint,
  quoteMint,
  baseIn,
  quoteIn
);

// Get initial pool price for UI
const initialPoolPrice = pumpAmmSdk.createAutocompleteInitialPoolPrice(
  initialBase,
  initialQuote
);

// Build and send transaction
const transaction = transactionFromInstructions(createPoolInstructions);
const signature = await sendAndConfirmTransaction(transaction);
```

## Deposit

For depositing into a (quote, base) pool:

```typescript
// When base input changes
const { quote, lpToken } =
  await pumpAmmSdk.depositAutocompleteQuoteAndLpTokenFromBase(
    pool,
    base,
    slippage
  );

// When quote input changes
const { base, lpToken } =
  await pumpAmmSdk.depositAutocompleteBaseAndLpTokenFromQuote(
    pool,
    quote,
    slippage
  );

// Execute deposit
const depositInstructions = await pumpAmmSdk.depositInstructions(
  pool,
  lpToken,
  slippage,
  user
);
const transaction = transactionFromInstructions(depositInstructions);
const signature = await sendAndConfirmTransaction(transaction);
```

## Swap

The SDK supports bi-directional swaps using the `Direction` enum:

```typescript
// Quote to Base swap (⬇️)
const baseAmount = await pumpAmmSdk.swapAutocompleteBaseFromQuote(
  pool,
  quoteAmount,
  slippage,
  Direction.QuoteToBase
);

// Base to Quote swap (⬆️)
const quoteAmount = await pumpAmmSdk.swapAutocompleteQuoteFromBase(
  pool,
  baseAmount,
  slippage,
  Direction.BaseToQuote
);

// Execute swap
const swapInstructions = await pumpAmmSdk.swapInstructions(
  pool,
  baseAmount,
  slippage,
  Direction.QuoteToBase,
  user
);
const transaction = transactionFromInstructions(swapInstructions);
const signature = await sendAndConfirmTransaction(transaction);
```

## Withdraw

```typescript
// Get expected output amounts
const { base, quote } = pumpAmmSdk.withdrawAutocompleteBaseAndQuoteFromLpToken(
  pool,
  lpToken,
  slippage
);

// Execute withdrawal
const withdrawInstructions = await pumpAmmSdk.withdrawInstructions(
  pool,
  lpToken,
  slippage,
  user
);
const transaction = transactionFromInstructions(withdrawInstructions);
const signature = await sendAndConfirmTransaction(transaction);
```

## License

MIT

## Links

- [Website](https://pump.fun)
- Documentation Coming
