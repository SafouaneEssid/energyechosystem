import fs from "fs";
import { Connection, Keypair } from "@solana/web3.js";
import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";

console.log("START simple mint");

const RPC = "https://api.devnet.solana.com";
const KEYPAIR_PATH = process.env.HOME + "/.config/solana/id.json";

console.log("Using RPC:", RPC);
console.log("Using keypair:", KEYPAIR_PATH);

if (!fs.existsSync(KEYPAIR_PATH)) {
  console.error("Keypair saknas:", KEYPAIR_PATH);
  process.exit(1);
}

const secret = Uint8Array.from(JSON.parse(fs.readFileSync(KEYPAIR_PATH, "utf8")));
const wallet = Keypair.fromSecretKey(secret);

const cache = JSON.parse(fs.readFileSync("asset-cache.json","utf8"));
const jsonUri = cache.assetItems && cache.assetItems["0"] && cache.assetItems["0"].jsonUri;
console.log("Found jsonUri:", jsonUri);

async function main(){
  const connection = new Connection(RPC, "confirmed");
  const metaplex = Metaplex.make(connection).use(keypairIdentity(wallet));
  console.log("Metaplex client ready. Wallet:", wallet.publicKey.toBase58());

  try {
    console.log("Calling metaplex.nfts().create()");
    const res = await metaplex.nfts().create({
      uri: jsonUri,
      name: "ELCoin NFT (simple)",
      sellerFeeBasisPoints: 0,
    });
    console.log("Create result keys:", Object.keys(res || {}));
    if (res && res.nft) {
      console.log("NFT minted:", res.nft.address.toBase58());
    } else {
      console.log("Create returned:", res);
    }
  } catch (err) {
    console.error("ERROR during mint:");
    console.error(err && err.stack ? err.stack : err);
  }
  console.log("END simple mint");
}

main();
