import test from "node:test";
import assert from "node:assert/strict";
import { scoreOpportunity, getAlertableOpportunities } from "./arbitrage.js";

test("calculates net profit after all costs", () => {
  const result = scoreOpportunity({ buyPrice: 20, sellPrice: 32, buyFees: 1, sellFees: 2, buyShipping: 2, sellShipping: 1 });
  assert.equal(result.netProfit, 6);
  assert.equal(result.meetsMinimum, true);
});

test("does not pass an opportunity below the 3 euro threshold", () => {
  const result = scoreOpportunity({ buyPrice: 20, sellPrice: 25, buyFees: 1, sellFees: 1 });
  assert.equal(result.netProfit, 3);
  assert.equal(result.meetsMinimum, true);
  const lower = scoreOpportunity({ buyPrice: 20, sellPrice: 24.99, buyFees: 1, sellFees: 1 });
  assert.equal(lower.meetsMinimum, false);
});

test("unverified prices cannot create an alert", () => {
  const result = scoreOpportunity({ buyPrice: 10, sellPrice: 25, verified: false, observedAt: new Date().toISOString() });
  assert.equal(result.netProfit, 15);
  assert.equal(result.eligibleForAlert, false);
});

test("only recent, eligible opportunities are returned for alerts", () => {
  const now = Date.now();
  const fresh = { eligibleForAlert: true, observedAt: new Date(now - 60_000).toISOString() };
  const stale = { eligibleForAlert: true, observedAt: new Date(now - 60 * 60_000).toISOString() };
  const unknown = { eligibleForAlert: false, observedAt: new Date(now).toISOString() };
  assert.deepEqual(getAlertableOpportunities([fresh, stale, unknown], { now, maxAgeMinutes: 30 }), [fresh]);
});

test("rejects invalid negative prices", () => {
  assert.throws(() => scoreOpportunity({ buyPrice: -1, sellPrice: 5 }), TypeError);
});
