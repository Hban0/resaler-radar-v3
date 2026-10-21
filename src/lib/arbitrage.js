export const MIN_NET_PROFIT_EUR = 3;

/**
 * Normalize a pair of comparable listings and calculate estimated net profit.
 * Inputs must be based on verified, current listing data. This function does not
 * scrape marketplaces or verify stock/prices itself.
 */
export function scoreOpportunity({
  buyPrice,
  sellPrice,
  buyFees = 0,
  sellFees = 0,
  buyShipping = 0,
  sellShipping = 0,
  otherCosts = 0,
  currency = "EUR",
  verified = false,
  observedAt = null,
}) {
  const values = [buyPrice, sellPrice, buyFees, sellFees, buyShipping, sellShipping, otherCosts];
  if (values.some(value => !Number.isFinite(Number(value)) || Number(value) < 0)) {
    throw new TypeError("Tous les prix et frais doivent être des nombres positifs ou nuls.");
  }

  const cost = Number(buyPrice) + Number(buyFees) + Number(buyShipping) + Number(otherCosts);
  const revenue = Number(sellPrice) - Number(sellFees) - Number(sellShipping);
  const netProfit = revenue - cost;
  const roiPercent = cost > 0 ? (netProfit / cost) * 100 : null;

  return {
    currency,
    totalCost: roundMoney(cost),
    netRevenue: roundMoney(revenue),
    netProfit: roundMoney(netProfit),
    roiPercent: roiPercent === null ? null : Math.round(roiPercent * 100) / 100,
    meetsMinimum: currency === "EUR" && netProfit >= MIN_NET_PROFIT_EUR,
    eligibleForAlert: Boolean(verified && observedAt && currency === "EUR" && netProfit >= MIN_NET_PROFIT_EUR),
    verified: Boolean(verified),
    observedAt,
    warning: verified ? null : "Prix non vérifiés : ne pas utiliser pour déclencher une alerte d'achat.",
  };
}

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Filter scored opportunities to alert-worthy entries, newest data first. */
export function getAlertableOpportunities(opportunities, { now = Date.now(), maxAgeMinutes = 30 } = {}) {
  const maxAgeMs = maxAgeMinutes * 60 * 1000;
  return opportunities.filter(item => {
    if (!item?.eligibleForAlert || !item.observedAt) return false;
    const observed = Date.parse(item.observedAt);
    if (!Number.isFinite(observed)) return false;
    const age = now - observed;
    return age >= 0 && age <= maxAgeMs;
  });
}
