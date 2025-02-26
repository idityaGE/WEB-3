import CryptoJS from "npm:crypto-js@4.2.0";

export function hashString(input: string): string {
  return CryptoJS.SHA256(input).toString();
}

console.log(hashString('hello world'));