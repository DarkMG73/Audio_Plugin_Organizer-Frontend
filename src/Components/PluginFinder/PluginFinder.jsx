import React, { useState, useEffect } from 'react';
import Styles from "./PluginFinder.module.css"
import {getLocalPluginData} from '../../storage/audioToolsDB'

const PluginFinder = () => {
const acceptedPluginWrappers = ['vst','vst3','component']
  const [fileNames, setFileNames] = useState([]);
  
useEffect(()=>{
      getLocalPluginData().then(data=>{
        console.log('plugin names---->',data)

        const acceptedPluginNames = new Set()
        
        data.forEach(name=>{
          console.log('%c⚪️►►►► %cline:13%cname', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(118, 77, 57);padding:3px;border-radius:2px', name)
          
          const nameArray =  name.split('.') 
          console.log('%c⚪️►►►► %cline:16%cnameArray', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(178, 190, 126);padding:3px;border-radius:2px', nameArray)

          const isValid =  acceptedPluginWrappers.includes(nameArray[name.split('.').length-1] )
          console.log('%c⚪️►►►► %cline:19%cisValid', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(3, 38, 58);padding:3px;border-radius:2px', isValid)

          console.log('%c⚪️►►►► %cline:25%cnameArray[0]', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(222, 125, 44);padding:3px;border-radius:2px', nameArray[0])


        if(isValid) acceptedPluginNames.add(nameArray[0])
      
      }
      ) 
     console.log('%c⚪️►►►► %cline:13%cacceptedPluginNames', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(89, 61, 67);padding:3px;border-radius:2px', acceptedPluginNames)
        setFileNames(Array.from(acceptedPluginNames))
      }).catch(err=>{
        console.log('err->', err)
      })
}, [])

  //  <button onClick={handleDirectorySelect}>Choose Directory</button>
  return (
    <div>
   
      <ul>
        {fileNames.map((fileName, index) => (
          <li key={index}>{fileName}</li>
        ))}
      </ul>
    </div>
  );
}

export default PluginFinder