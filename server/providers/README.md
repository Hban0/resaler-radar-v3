# Provider contract

This file defines the adapter contract for future marketplace integrations. No marketplace connector is active yet.

A provider adapter must expose:
- `id`: stable provider name.
- `search(query, options)`: asynchronous search returning normalized listings.
- `status()`: whether the adapter is configured and authorized.

Each normalized listing should include:
- `provider`, `listingId`, `title`, `productKey`
- `price`, `currency`, `available`, `url`, `observedAt`
- `buyFee`, `shippingCost` where known
- `verified`: true only when fetched from a permitted, trustworthy source.

## Comparison rules
1. Do not compare listings unless their product identity matches (edition, region, quantity, platform, duration and condition as applicable).
2. Convert to EUR using a documented rate source and timestamp before comparing cross-currency listings.
3. Sort by landed purchase cost: listing price + buying fees + inbound shipping.
4. Estimate resale net: expected resale price - seller fees - payment fees - outbound shipping - purchase landed cost - other costs.
5. Alerts require current, verified listings, a valid listing URL and net profit >= EUR 3.
6. Missing fees or ambiguous product identity must be marked unknown, never silently treated as zero.
7. Respect platform terms, rate limits and access permissions. Do not bypass authentication or anti-bot controls.

## Current implementation
Only the profitability calculation and search-link UI exist. This contract is not a live adapter and does not imply any data has been fetched.
