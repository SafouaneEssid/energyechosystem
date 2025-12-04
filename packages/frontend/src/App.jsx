import React, { useEffect, useState } from "react";

export default function App() {
  const [provider, setProvider] = useState(null);
  const [publicKey, setPublicKey] = useState(null);

  useEffect(() => {
    // Phantom injects window.solana
    if (window?.solana && window.solana.isPhantom) {
      setProvider(window.solana);
      // Optionally auto-connect if already trusted
      window.solana.connect({ onlyIfTrusted: true }).then((res) => {
        setPublicKey(res.publicKey.toString());
      }).catch(() => {});
    }
  }, []);

  const connect = async () => {
    try {
      const resp = await provider.connect();
      setPublicKey(resp.publicKey.toString());
    } catch (err) {
      console.error("Wallet connection failed", err);
    }
  };

  const disconnect = async () => {
    try {
      await provider.disconnect();
      setPublicKey(null);
    } catch (err) {
      console.warn("Disconnect failed", err);
      setPublicKey(null);
    }
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <h1>Ecosystem — Frontend</h1>
      <p>Simple Phantom wallet connect demo (Solana devnet).</p>

      {provider ? (
        <div>
          {publicKey ? (
            <>
              <div>
                <strong>Connected wallet:</strong>
                <div style={{ marginTop: 8, wordBreak: "break-all" }}>{publicKey}</div>
              </div>
              <button style={{ marginTop: 12 }} onClick={disconnect}>Disconnect</button>
            </>
          ) : (
            <button onClick={connect}>Connect Phantom Wallet</button>
          )}
        </div>
      ) : (
        <div>
          <p>No Phantom wallet detected in the browser.</p>
          <p>
            Install Phantom from <a href="https://phantom.app/" target="_blank" rel="noreferrer">phantom.app</a> and
            reload the page.
          </p>
        </div>
      )}
    </div>
  );
}
