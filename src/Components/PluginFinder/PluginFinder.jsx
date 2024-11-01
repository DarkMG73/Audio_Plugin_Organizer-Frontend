import React, { useState, useEffect } from 'react';
import {useSelector} from 'react-redux'
import Styles from "./PluginFinder.module.css"
import {getLocalPluginData} from '../../storage/audioToolsDB'
import BarLoader from "../../UI/Loaders/BarLoader/BarLoader";

const PluginFinder = () => {
  const {allTools} = useSelector((state) => state.toolsData);
  console.log('%c⚪️►►►► %cline:7%callTools', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(217, 104, 49);padding:3px;border-radius:2px', allTools)
  const acceptedPluginWrappers = ['vst','vst3','component']
  const [fileNames, setFileNames] = useState([]);
  const [currentNameInSearch, setCurrentNameInSearch] = useState(true)
  const [findNewPlugins, setFindNewPlugins] = useState(false);
  const handleFindNewPluginsBUtton = (e)=>{
    setFindNewPlugins(!findNewPlugins)
  }
useEffect(()=>{
  if(findNewPlugins) {
    
    setCurrentNameInSearch(true)
    getLocalPluginData().then(
        data=>{
            console.log('plugin names---->',data)

            const acceptedPluginNames = new Set()
            
            data.forEach(name=>{
              const nameArray =  name.split('.') 

              const isValid =  acceptedPluginWrappers.includes(nameArray[name.split('.').length-1] )

              if(isValid) acceptedPluginNames.add(nameArray[0])
              }
            ) 


            console.log('%c⚪️►►►► %cline:35%cacceptedPluginNames', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(222, 125, 44);padding:3px;border-radius:2px', acceptedPluginNames)
            
            const matchedNames = []
            const groomedList = []
            // Remove existing plugin names
            for ( const name of  acceptedPluginNames ) {
             
                if(!matchedNames.includes(name)){
                  for (const value of  Object.values(allTools)) {
                    const referenceID = value.masterLibraryID || value.name
                    
                    if(name.replaceAll(' ','').includes(referenceID.replaceAll(' ',''))) {
                      matchedNames.push(name)
                      break
                    }               
                }
              }
              
              if(!matchedNames.includes(name)) { 
                groomedList.push(name) 
               
              }
            }

          console.log('%c⚪️►►►► %cline:39%cmatchedNames', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(20, 68, 106);padding:3px;border-radius:2px', matchedNames)

          console.log('%c⚪️►►►► %cline:41%cgroomedList', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(251, 178, 23);padding:3px;border-radius:2px', groomedList)

          setFileNames(groomedList)
          setCurrentNameInSearch(false)
        }
    ).catch(err=>{
          setCurrentNameInSearch(false)
        console.log('err->', err)
      })}
      
}, [findNewPlugins])


  return (
    <div className={Styles['plugin-finder-container']}>
   <button onClick={handleFindNewPluginsBUtton}>Find New Plugins</button>
      <ul>
        {findNewPlugins &&
        <div>
         {currentNameInSearch &&
              <div key="loader" className={Styles["loader-wrap"]}>
              <BarLoader />
            </div>
          }
         {fileNames.length > 0 && <h3>{fileNames.length}</h3>}
        {fileNames.map((fileName, index) => (
          <li key={index}>{fileName}</li>
        ))}
        </div>
        }
      </ul>
    </div>
  );
}

export default PluginFinder