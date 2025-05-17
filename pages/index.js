import { useState } from "react";

export default function Home() {
  const [source, setSource] = useState("pumpfun");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCheck = async () => {
    if (!address) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await fetch(`/api/${source}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <main style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h1>Solana Token Scanner 🔍</h1>
      <p>Paste a contract address to get a Buy Score & ROI prediction.</p>

      <div style={{ marginBottom: "10px" }}>
        <select value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="pumpfun">Pump.fun</option>
          <option value="dexscreener">Dexscreener</option>
        </select>
      </div>

      <input
        type="text"
        placeholder="Paste contract address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      <button onClick={handleCheck} disabled={loading}>
        {loading ? "Checking..." : "Check Token"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: "20px", background: "#f5f5f5", padding: "15px", borderRadius: "8px" }}>
          <h3>✅ Score: {result.buyScore}/100</h3>
          <h4>📈 Predicted ROI: {result.predictedROI.toFixed(1)}%</h4>
          {result.risks.length > 0 && (
            <>
              <h4>⚠️ Risks:</h4>
              <ul>
                {result.risks.map((risk, i) => (
                  <li key={i}>{risk}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </main>
  );
}
