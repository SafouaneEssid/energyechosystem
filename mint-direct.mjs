import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import dotenv from "dotenv";

dotenv.config();

const RPC = "https://api.devnet.solana.com";
const connection = new Connection(RPC);

async function main() {
    const wallet = Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(require("fs").readFileSync(process.env.HOME + "/.config/solana/id.json")))
    );

    const metaplex = Metaplex.make(connection)
        .use(keypairIdentity(wallet))
        .use(bundlrStorage());

    const metadataUri = "https://gateway.irys.xyz/7kdntX1p1EktfpW7jW9A7bxNK6E6b4z2c5M9XbRsxV2";

    console.log("Minting NFT...");
    const { nft } = await metaplex.nfts().create({
        uri: metadataUri,
        name: "ELCOIN NFT",
        sellerFeeBasisPoints: 500,
        symbol: "ELC",
    });

    console.log("NFT Minted!");
    console.log("Mint Address:", nft.address.toBase58());
}

main().catch(console.error);

