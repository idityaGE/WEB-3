import * as ed from "@noble/ed25519"
import * as secp from "@noble/secp256k1"

const ed25519 = async () => {
  const privateKey = ed.utils.randomPrivateKey();
  const publickey = await ed.getPublicKeyAsync(privateKey)
  const message = new TextEncoder().encode("10 SOL => public key 1 | public key 2")
  const signature = await ed.signAsync(message, privateKey);

  const isValid = await ed.verifyAsync(signature, message, publickey);

  console.log("ed25519 :", isValid);
}

ed25519()


const secp256k1 = async () => {
  // Uint8Arrays or hex strings are accepted:
  // Uint8Array.from([0xde, 0xad, 0xbe, 0xef]) is equal to 'deadbeef'
  const privKey = secp.utils.randomPrivateKey(); // Secure random private key
  // sha256 of 'hello world'
  const msgHash = 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9';
  const pubKey = secp.getPublicKey(privKey);
  const signature = await secp.signAsync(msgHash, privKey); // Sync methods below
  const isValid = secp.verify(signature, msgHash, pubKey);

  console.log("secp256k1 :", isValid);
}

secp256k1()
