import React, { useState } from 'react';
import DropZone from './DropZone';
import { decrypt, loadCryptoKey } from '../helpers/crypto';

export default function FileZone({ keytext }) {
  const [encrypted, setEncrypted] = useState('');
  const [decrypted, setDecrypted] = useState('');

  function uploadCallback(results) {
    setEncrypted(results);
  }

  async function decryptResults(resultsObject, keystring) {
    const key = await loadCryptoKey(keystring);
    const decryptedObj = await decrypt(resultsObject.encryptedBuffer, key, resultsObject.iv);
    setDecrypted(new TextDecoder().decode(decryptedObj));
  }

  console.log(`returning encrypted: ${encrypted}, decrypted: ${decrypted}`);

  return (
    <div>
      <h1>{JSON.stringify(encrypted)}</h1>
      <h1>{decrypted}</h1>
      <DropZone uploadCallback={uploadCallback} keytext={keytext} />
      <pre>{keytext}</pre>
      <button type="button" onClick={() => decryptResults(encrypted, keytext)}>
        Decrypt
      </button>
    </div>
  );
}
