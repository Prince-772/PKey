import CryptoJS from "crypto-js";

export const generateAuthData = (masterPass, existingSalt = null) => {
  if (!masterPass) {
    throw new Error("Master password is required");
  }

  // Use existing salt (login) OR generate new (signup)
  const salt = existingSalt
    ? CryptoJS.enc.Hex.parse(existingSalt)
    : CryptoJS.lib.WordArray.random(16);

  const masterKey = CryptoJS.PBKDF2(masterPass, salt, {
    keySize: 256 / 32,
    iterations: 150000,
  });

  const authHash = CryptoJS.SHA256(masterKey + "auth").toString();
  const encryptionKey = CryptoJS.SHA256(masterKey + "enc").toString();

  return {
    salt: salt.toString(), // store/send this
    authHash,
    encryptionKey, // Will not be send to server
  };
};