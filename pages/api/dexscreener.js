import axios from "axios";
import { calculateBuyScore, calculatePredictedROI } from "../../utils/scoring";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { address } = req.body;
  if (!address) return res.status(400).json({ error: "No contract address provided" });

  try {
    const response = await axios.get(`https://api.dexscreener.com/latest/dex/pairs/solana/${address}`);
    const tokenData = response.data.pair;

    const buyScore = calculateBuyScore(tokenData, "dexscreener");
    const predictedROI = calculatePredictedROI(tokenData, "dexscreener");

    const risks = [];
    if (tokenData.priceUsd < 0.0001) risks.push("Extremely low price");
    if (tokenData.txns24h < 10) risks.push("Low 24h activity");
    if (tokenData.liquidity.usd < 500) risks.push("Low liquidity");

    return res.status(200).json({
      buyScore,
      predictedROI,
      risks,
      details: tokenData,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch token data" });
  }
}
