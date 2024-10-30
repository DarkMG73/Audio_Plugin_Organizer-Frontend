import React, { useState } from 'react';
import Styles from "./PluginFinder.module.css"


const PluginFinder = () => {

  const [fileNames, setFileNames] = useState([]);

  const handleDirectorySelect = async () => {
    try {
      const directoryHandle = await Window.showDirectoryPicker();
      const files = [];
//
      for await (const entry of directoryHandle.values()) {
        if (entry.kind === 'file') {
          files.push(entry.name);
        }
      }

      setFileNames(files);
    } catch (error) {
      console.error('Error selecting directory:', error);
    }
  };

  return (
    <div>
      <button onClick={handleDirectorySelect}>Choose Directory</button>
      <ul>
        {fileNames.map((fileName, index) => (
          <li key={index}>{fileName}</li>
        ))}
      </ul>
    </div>
  );
}

export default PluginFinder