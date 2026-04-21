
export const generateAuthData = (masterPass, existingSalt = null) => {
  
  return new Promise((resolve, reject) => {
    if (!masterPass) {
      return reject(new Error("Master password is required"));
    }

    const worker = new Worker(
      new URL("@/lib/masterpassword/mPassWorker.js", import.meta.url)
    );

    worker.postMessage({ masterPass, existingSalt });

    worker.onmessage = (event) => {
      if (event.data.success) {
        const { authHash, encryptionKey, salt } = event.data.data;
        worker.terminate();
        resolve({
          salt, // store/send this
          authHash, // For Verification
          encryptionKey, // Will not be send to server
        });
      } else {
        worker.terminate();
        reject(new Error(event.data.message || "Can't generate AuthData"));
      }
    };

    worker.onerror = () => {
      worker.terminate();
      reject(new Error("Worker thread failed to execute"));
    };
  });
};