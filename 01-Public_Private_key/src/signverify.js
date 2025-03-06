import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import { encode } from "bs58";

const publicKey = "77xACsirSsQjUNGtwWqvk3un63sJ8xG3Akc8C24jxbec"
const privateKey = "3fc9c0f829926a4320a8d9d7b588579a398094dd4c31662d6610f15552988af65aedf97c81d737c1c71ba6525e2d74ef9ab916eb9102ebd6ed9dc2243b59ce25"


const signature = "58wAbVgnCPczkYRwk5AdKqiBz2dyeK3zQP25dkwRkfdzPurWiX7fX5QKHckJvQxTqpG96kgrPqa7dR1pqwpKgT6a"

/*
PS D:\solana-release\bin> .\solana.exe airdrop 1000
Requesting airdrop of 1000 SOL

Signature: 4CcD13J8p62RjrLWdgov3rfCwESXf75tZ8afoqYNJ8Zw8fJW3J6nysKCstEdRCFXNNFPWQ5h3maZsKfr3uC875n3
 */


const signatureBytes = bs58.decode(signatureString);

function checkMessage(potentialMessage) {
  const messageBytes = Buffer.from(potentialMessage);
  const publicKeyBytes = new PublicKey(publicKeyString).toBytes();

  const isValid = nacl.sign.detached.verify(
    messageBytes,
    signatureBytes,
    publicKeyBytes
  );

  return isValid;
}
