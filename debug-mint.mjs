import fs from "fs";
console.log("1 - debug start");
console.log("cwd:", process.cwd());
console.log("node version:", process.version);
const keyFile = process.env.HOME + "/.config/solana/id.json";
console.log("keyfile path:", keyFile);
console.log("keyfile exists:", fs.existsSync(keyFile));
try {
  const content = fs.readFileSync(keyFile, "utf8");
  console.log("keyfile len:", content.length);
} catch (e) {
  console.error("read key error:", e.message);
}
console.log("asset-cache.json exists:", fs.existsSync("asset-cache.json"));
try {
  const cache = JSON.parse(fs.readFileSync("asset-cache.json","utf8"));
  console.log("found asset keys:", Object.keys(cache.assetItems || {}));
  console.log("first jsonUri:", cache.assetItems && cache.assetItems["0"] && cache.assetItems["0"].jsonUri);
} catch(e){
  console.error("asset-cache parse error:", e.message);
}
console.log("2 - debug end");
