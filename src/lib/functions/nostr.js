import  bech32  from "bech32";

// Decode npub to public key hex
export function decodeNpub(npub) {
    const decoded = bech32.decode(npub);
    return Buffer.from(bech32.fromWords(decoded.words)).toString("hex");
  }
  
  export function decodeNsec(nsec) {
    const decoded = bech32.decode(nsec);
    return Buffer.from(bech32.fromWords(decoded.words)).toString("hex");
  }
  
  export function encodeNpub(publicKeyHex) {
    const publicKeyBytes = Buffer.from(publicKeyHex, "hex");
    const words = bech32.toWords(publicKeyBytes);
    return bech32.encode("npub", words);
  }
  
  export function encodeNsec(secretKeyHex) {
    const secretKeyBytes = Buffer.from(secretKeyHex, "hex");
    const words = bech32.toWords(secretKeyBytes);
    return bech32.encode("nsec", words);
  }
  
  export 
  function encodePlainSecret(sk) {
    return Array.from(sk)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }