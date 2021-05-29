import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { encryptFile } from '../helpers/crypto';

export default function DropZone({ keytext, uploadCallback }) {
  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = async () => {
        const fileContents = reader.result;
        const encryptResults = await encryptFile(fileContents, keytext);
        uploadCallback(encryptResults);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const style = {
    border: '3px solid blue',
    width: '200px',
    height: '200px',
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  return (
    <div style={style} { ...getRootProps() }>
      <input { ...getInputProps() } />
      <p>Drag and drop some files here, or click to select files</p>
    </div>
  )
}
