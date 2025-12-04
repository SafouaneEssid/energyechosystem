import React, { useEffect, useState } from "react";

export default function App() {
  const [provider, setProvider] = useState(null);
  const [publicKey, setPublicKey] = useState(null);

  useEffect(() => {
    // Check if Phantom is installed
    if (window?.solana && window.solana.isPhantom) {
      setProvider(window.solana);

      // Try auto-connect if user previously approved
      window.solana.connect({ onlyIfTrusted: true }).then((resp) => {
        setPublicKey(resp.publicKey.toString());
      }).catch(() => {});
    }
  }, []);

  const connectWallet = async () => {
    if (!provider) return;
    try {
      const resp = await provider.connect();
      setPublicKey(resp.publicKey.toString());
    } catch (err) {
      console.error("Connection failed:", err);
    }
  };

  const disconnectWallet = async () => {
    try {
      await provider.disconnect();
      setPublicKey(null);
    } catch (err) {
      console.warn("Disconnect error:", err);
    }
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <h1>Ecosystem — Frontend</h1>
      <p>Phantom Wallet Connect Demo (Solana Devnet)</p>

      {!provider && (
        <div style={{ marginTop: 20 }}>
          <strong>Phantom Wallet not detected.</strong>
          <p>Install it at: <a href="https://phantom.app" target="_blank">phantom.app</a></p>
        </div>
      )}

      {provider && !publicKey && (
        <button
          onClick={connectWallet}
          style={{ padding: "10px 20px", marginTop: 20 }}
        >
          Connect Phantom Wallet
        </button>
      )}

      {publicKey && (
        <div style={{ marginTop: 20 }}>
          <div><strong>Connected Wallet:</strong></div>
          <div style={{ marginTop: 8, wordBreak: "break-word" }}>{publicKey}</div>
          <button
            onClick={disconnectWallet}
            style={{ padding: "10px 20px", marginTop: 20 }}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
