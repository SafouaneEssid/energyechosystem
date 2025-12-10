import { Connection, PublicKey } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";
import dotenv from "dotenv";
dotenv.config();

const RPC = process.env.RPC || "https://api.devnet.solana.com";
const CANDY = process.env.CANDY_MACHINE_ID || "EyhEKHSgGToKkgGYJqb6vWzLXJSfXTudB2EQL9qF9qCA";

async function main() {
  const connection = new Connection(RPC, "confirmed");
  const metaplex = Metaplex.make(connection);

  console.log("RPC:", RPC);
  console.log("Candy:", CANDY);

  try {
    const cmPub = new PublicKey(CANDY);
    if (typeof metaplex.candyMachinesV2 === "function") {
      const client = metaplex.candyMachinesV2();
      if (typeof client.findByAddress === "function") {
        const cm = await client.findByAddress({ address: cmPub });
        console.log("itemsAvailable:", cm.itemsAvailable?.toString?.() ?? cm.itemsAvailable);
        console.log("itemsRedeemed:", cm.itemsRedeemed?.toString?.() ?? cm.itemsRedeemed);
        console.log("itemsRemaining:", cm.itemsRemaining?.toString?.() ?? cm.itemsRemaining);
        console.log("price:", cm.price?.toString?.() ?? cm.price);
        console.log("authority:", cm.authority?.toBase58?.() ?? cm.authority);
        console.log("collection:", cm.collection?.address?.toBase58?.() ?? cm.collection);
        console.log("guards keys:", cm.guards ? Object.keys(cm.guards) : "none");
      } else {
        console.log("Candy client finns men saknar findByAddress — keys:", Object.keys(client));
      }
    } else {
      console.log("metaplex.candyMachinesV2() saknas i din @metaplex/js-version.");
      const acc = await connection.getAccountInfo(cmPub);
      console.log("Account lamports:", acc?.lamports);
      console.log("Account data length:", acc?.data?.length);
    }
  } catch (err) {
    console.error("Failed to read candy machine:", err);
  }
}

main();
