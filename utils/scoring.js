export function calculateBuyScore(tokenData, source = "dexscreener") {
  let score = 0;

  if (source === "dexscreener") {
    if (tokenData.liquidity?.usd > 500) score += 20;
    if (tokenData.txns24h > 50) score += 20;
    if (parseFloat(tokenData.priceChange?.h1) > 0) score += 20;
    if (parseFloat(tokenData.volume?.h24) > 1000) score += 20;
    if (parseFloat(tokenData.fdv) < 1000000) score += 20;
  }

  if (source === "pumpfun") {
    if (tokenData.totalSolRaised > 5) score += 25;
    if (tokenData.recentBuyVelocity > 10) score += 25;
    if (!tokenData.mintEnabled) score += 25;
    if (tokenData.deployerBuying) score += 25;
  }

  return score;
}

export function calculatePredictedROI(tokenData, source = "dexscreener") {
  if (source === "dexscreener") {
    const txns = tokenData.txns24h || 0;
    const liquidity = tokenData.liquidity?.usd || 0;
    return Math.min(500, (txns * 2) + (liquidity / 100));
  }

  if (source === "pumpfun") {
    const buyers = tokenData.buyCount || 0;
    const sol = tokenData.totalSolRaised || 0;
    return Math.min(1000, (buyers * 2) + (sol * 20));
  }

  return 0;
}
