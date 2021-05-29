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

  const preStyle = { fontSize: '8pt', textAlign: 'left' };
  return (
    <div style={{ align: 'left' }}>
      <DropZone uploadCallback={uploadCallback} keytext={keytext} />
      <p style={preStyle}>{JSON.stringify(encrypted)}</p>
      <h3>Key: </h3>
      <p id="key_id" style={preStyle}>
        {keytext}
      </p>
      <button type="button" onClick={() => decryptResults(encrypted, keytext)}>
        Decrypt
      </button>
      <p style={preStyle}>{decrypted}</p>
    </div>
  );
}
