import fs from "fs";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import dotenv from "dotenv";
dotenv.config();

const RPC = process.env.RPC || "https://api.devnet.solana.com";
const CANDY_MACHINE_ID = process.env.CANDY_MACHINE_ID || "EyhEKHSgGToKkgGYJqb6vWzLXJSfXTudB2EQL9qF9qCA";
const KEYPAIR_PATH = process.env.KEYPAIR_PATH || `${process.env.HOME}/.config/solana/id.json`;

if (!fs.existsSync(KEYPAIR_PATH)) {
  console.error("Keypair file not found:", KEYPAIR_PATH);
  process.exit(1);
}

const keypairData = JSON.parse(fs.readFileSync(KEYPAIR_PATH, "utf8"));
const secret = Uint8Array.from(keypairData);
const keypair = Keypair.fromSecretKey(secret);

async function main() {
  const connection = new Connection(RPC, "confirmed");
  const metaplex = Metaplex.make(connection).use(keypairIdentity(keypair));
  const candyMachinePubkey = new PublicKey(CANDY_MACHINE_ID);

  console.log("RPC:", RPC);
  console.log("Candy machine:", candyMachinePubkey.toBase58());
  console.log("Wallet:", keypair.publicKey.toBase58());

  try {
    if (typeof metaplex.candyMachinesV2 === "function") {
      console.log("Using candyMachinesV2 client...");
      const client = metaplex.candyMachinesV2();

      if (typeof client.mint === "function") {
        const res = await client.mint({ candyMachine: candyMachinePubkey });
        console.log("Mint response:", res);
      } else if (typeof client.mintV2 === "function") {
        const res = await client.mintV2({ candyMachine: candyMachinePubkey });
        console.log("Mint response:", res);
      } else {
        console.error("candyMachinesV2 client has no mint/mintV2. Keys:", Object.keys(client));
      }
    } else {
      console.warn("candyMachinesV2() not available — fallback creating a single NFT (not via candy machine).");
      const { uri } = await metaplex.nfts().uploadMetadata({
        name: "Fallback ELC NFT",
        description: "Fallback mint (not candy machine)",
        image: "", 
      });
      console.log("Uploaded metadata uri:", uri);
      const { nft } = await metaplex.nfts().create({
        uri,
        name: "Fallback ELC NFT",
        sellerFeeBasisPoints: 0,
      });
      console.log("Created NFT:", nft.address.toBase58());
    }
  } catch (err) {
    console.error("Mint failed:");
    console.error(err);
    if (err && err.stack) console.error(err.stack);
  }
}

main();
