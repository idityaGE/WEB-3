
const encoded = new TextEncoder().encode("Hello World")

console.log("Message :", encoded)

const base64Encoded = Buffer.from(encoded).toString('base64')
console.log(base64Encoded)

const decoded = new TextDecoder().decode(encoded)
console.log("Decoded :", decoded)

// #=== ASCII ===#
function asciiToBytes(asciiString) {
  return new Uint8Array([...asciiString].map(char => char.charCodeAt(0)));
}

function bytesToAscii(byteArray) {
  return new TextDecoder().decode(byteArray);
}


function asciiToBytes(asciiString) {
  const byteArray = [];
  for (let i = 0; i < asciiString.length; i++) {
    byteArray.push(asciiString.charCodeAt(i));
  }
  return byteArray;
}

function bytesToAscii(byteArray) {
  return byteArray.map(byte => String.fromCharCode(byte)).join('');
}


// #=== HEX ===#
function arrayToHex(byteArray) {
  let hexString = '';
  for (let i = 0; i < byteArray.length; i++) {
    hexString += byteArray[i].toString(16).padStart(2, '0');
  }
  return hexString;
}

function hexToArray(hexString) {
  const byteArray = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < byteArray.length; i++) {
    byteArray[i] = parseInt(hexString.substr(i * 2, 2), 16);
  }
  return byteArray;
}
