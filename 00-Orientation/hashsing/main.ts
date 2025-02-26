import CryptoJS from "npm:crypto-js@4.2.0";
import * as console from "node:console";


export function hashString(input: string): string {
  return CryptoJS.SHA256(input).toString();
}

console.log(hashString('Aditya'));