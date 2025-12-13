import { Connection, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";

const RPC = "https://api.devnet.solana.com";
const MINT = new PublicKey("FoaFC7Qn8ZSDpvK5ojrHamuRuiwdwahXHa1bBhp2cups");
const REQUIRED = 1000n * 10n ** 9n; // 1000 ELC (decimals 9)

const wallet = process.argv[2];
if (!wallet) {
  console.error("Usage: node check-access.mjs <WALLET_ADDRESS>");
  process.exit(1);
}

const run = async () => {
  const connection = new Connection(RPC);
  const owner = new PublicKey(wallet);

  const ata = await getAssociatedTokenAddress(MINT, owner);
  const account = await getAccount(connection, ata);

  if (account.amount >= REQUIRED) {
    console.log("ACCESS GRANTED");
  } else {
    console.log("ACCESS DENIED");
  }
};

run();
