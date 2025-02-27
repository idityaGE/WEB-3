import CryptoJS from "npm:crypto-js@4.2.0";
import * as console from "node:console";


export function hashString(input: string): string {
  return CryptoJS.SHA256(input).toString();
}

// console.log(hashString('Aditya'));


const findHash = (prefix: string) => {
  const now = Date.now();
  console.log("🔍 Searching for prefix :", prefix)
  while (true) {
    const hash = hashString((Math.random() * (Math.random() * 100)).toString())
    if (hash.startsWith(prefix)) {
      console.log("🟢 Found :", hash);
      break
    }
  }
  console.log("⌚ Time Taken :", Date.now() - now)
}

const prefix = "00000"
findHash(prefix)


// Proof of work [ Nonce ]

// 1. Take a random string
// 2. Hash it
// 3. Check if the hash starts with <number> zeros
// 4. If not, repeat the process
// 5. If yes, stop and return the hash
