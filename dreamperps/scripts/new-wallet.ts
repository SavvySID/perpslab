import { existsSync, writeFileSync } from "node:fs"
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts"

// Creates a fresh testnet-only bot key in .env (gitignored). Never reuse a real wallet here.
if (existsSync(".env")) {
  console.log(".env already exists, not overwriting it.")
  process.exit(0)
}

const privateKey = generatePrivateKey()
const { address } = privateKeyToAccount(privateKey)
writeFileSync(".env", `PRIVATE_KEY=${privateKey}\nMARKET=BTC\n`)

console.log(`Bot address: ${address}`)
console.log("Private key saved to .env. Link this address in the dreamDEX app (Link a bot) to fund its gas.")
