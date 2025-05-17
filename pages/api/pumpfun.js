import axios from "axios";
import { calculateBuyScore, calculatePredictedROI } from "../../utils/scoring";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { address } = req.body;
  if (!address) return res.status(400).json({ error: "No contract address provided" });

  try {
    const apiUrl = `https://pumpfun-scraper-production.up.railway.app/api/scrape?address=${address}`;
    const response = await axios.get(apiUrl);
    const tokenData = response.data;

    const buyScore = calculateBuyScore(tokenData, "pumpfun");
    const predictedROI = calculatePredictedROI(tokenData, "pumpfun");

    const risks = [];
    if (!tokenData.liquidityLocked) risks.push("Liquidity not locked");
    if (tokenData.mintEnabled) risks.push("Mint still enabled");
    if (!tokenData.deployerBuying) risks.push("Deployer hasn't bought");
    if (tokenData.recentBuyVelocity < 10) risks.push("Low buy velocity");

    return res.status(200).json({
      buyScore,
      predictedROI,
      risks,
      details: tokenData,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch Pump.fun data" });
  }
}
