import { argon2id } from "hash-wasm";

self.onmessage = async function (e) {
  const { masterPass, existingSalt } = e.data;

  try {
    // Salt handling (Uint8Array)
    let salt;
    if (existingSalt) {
      salt = new Uint8Array(
        existingSalt.match(/.{1,2}/g).map(b => parseInt(b, 16))
      );
    } else {
      salt = crypto.getRandomValues(new Uint8Array(16));
    }

    // Argon2id master key (raw bytes)
    const masterKeyRaw = await argon2id({
      password: masterPass,
      salt,
      parallelism: 1,
      iterations: 3,
      memorySize: 65536, // 64MB
      hashLength: 32,
      outputType: "binary",
    });

    // Import into Web Crypto
    const masterKey = await crypto.subtle.importKey(
      "raw",
      masterKeyRaw,
      "HKDF",
      false,
      ["deriveBits", "deriveKey"]
    );

    // HKDF - authKey
    const authKey = await crypto.subtle.deriveBits(
      {
        name: "HKDF",
        hash: "SHA-256",
        salt: new Uint8Array([]),
        info: new TextEncoder().encode("auth"),
      },
      masterKey,
      256
    );

    // HKDF - encryptionKey (AES-GCM)
    const encryptionKey = await crypto.subtle.deriveKey(
      {
        name: "HKDF",
        hash: "SHA-256",
        salt: new Uint8Array([]),
        info: new TextEncoder().encode("enc"),
      },
      masterKey,
      {
        name: "AES-GCM",
        length: 256,
      },
      false,
      ["encrypt", "decrypt"]
    );

    // Convert authKey - hex (for storage/verification)
    const authHashHex = Array.from(new Uint8Array(authKey))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    // Convert salt - hex
    const saltHex = Array.from(salt)
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    self.postMessage({
      success: true,
      data: {
        salt: saltHex,
        authHash: authHashHex,
        encryptionKey, // CryptoKey object
      },
    });

  } catch (error) {
    self.postMessage({
      success: false,
      message: error.message,
    });
  }
};