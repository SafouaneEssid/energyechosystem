import fs from "fs";
import { Connection, Keypair } from "@solana/web3.js";
import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import dotenv from "dotenv";
dotenv.config();

const RPC = process.env.RPC || "https://api.devnet.solana.com";
const KEYPAIR_PATH = process.env.KEYPAIR_PATH || `${process.env.HOME}/.config/solana/id.json`;

// Get jsonUri directly from asset-cache.json
const cache = JSON.parse(fs.readFileSync("asset-cache.json", "utf8"));
const first = cache.assetItems && cache.assetItems["0"];
const jsonUri = first && (first.jsonUri || first.jsonuri || first.jsonURI);

if (!jsonUri) {
  console.error("Hittade ingen jsonUri i asset-cache.json");
  process.exit(1);
}

const keypairData = JSON.parse(fs.readFileSync(KEYPAIR_PATH, "utf8"));
const secret = Uint8Array.from(keypairData);
const keypair = Keypair.fromSecretKey(secret);

async function main(){
  const connection = new Connection(RPC, "confirmed");
  const metaplex = Metaplex.make(connection).use(keypairIdentity(keypair));

  console.log("RPC:", RPC);
  console.log("Wallet:", keypair.publicKey.toBase58());
  console.log("Using metadata URI:", jsonUri);

  try {
    const { nft } = await metaplex.nfts().create({
      uri: jsonUri,
      name: "ELCoin NFT (direct mint)",
      sellerFeeBasisPoints: 0,
    });
    console.log("Created NFT address:", nft.address.toBase58());
  } catch (err) {
    console.error("Direct mint failed:");
    console.error(err);
  }
}

main();
