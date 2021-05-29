export async function generateKey() {
  /*
  Generate an encryption key, then set up event listeners
  on the "Encrypt" and "Decrypt" buttons.
  */
  const key = await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt'],
  );
  return key;
}

async function exportCryptoKey(key) {
  const exported = await window.crypto.subtle.exportKey('jwk', key);
  return JSON.stringify(exported, null, ' ');
}

export async function loadCryptoKey(keytext) {
  const keyobj = JSON.parse(keytext);
  return crypto.subtle.importKey('jwk', keyobj, 'AES-GCM', true, ['encrypt', 'decrypt']);
}

export async function generateKeyText() {
  const key = await generateKey();
  const keyText = await exportCryptoKey(key);
  return keyText;
}

export async function encrypt(buffer, key) {
  // encrypt the ArrayBuffer and return
  // the encrypted contents and the random key
  // const enc = new TextEncoder();
  // const encoded = enc.encode(buffer);

  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    buffer,
  );

  return {
    iv,
    encryptedBuffer,
  };
}

export async function encryptFile(fileBuffer, keytext) {
  // Encrypt the file
  const jwk = JSON.parse(keytext);
  const cryptoKey = await crypto.subtle.importKey('jwk', jwk, 'AES-GCM', true, ['encrypt', 'decrypt']);
  // const generatedKey = await generateKey();
  const encryptionResult = await encrypt(fileBuffer, cryptoKey);
  const key = await exportCryptoKey(cryptoKey);
  return {
    key,
    ...encryptionResult,
  };
}

export async function decrypt(buffer, key, iv) {
  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    buffer,
  );
  return decrypted;
}

