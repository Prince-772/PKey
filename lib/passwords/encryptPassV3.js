import CryptoJS from "crypto-js";

// Encryption Function
export const encryptV3 = (plainText, encryptionKey) => {
  const encrypted = CryptoJS.AES.encrypt(plainText, encryptionKey).toString();
  
  // Can be saved on server
  return encrypted; 
};

// Decryption Function
export const decryptV3 = (cipherText, encryptionKey) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, encryptionKey);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  
  if (!originalText) throw new Error("Decryption failed. Invalid Key.");
  return originalText;
};