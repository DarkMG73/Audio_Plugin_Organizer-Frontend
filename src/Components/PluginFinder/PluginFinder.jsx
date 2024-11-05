import React, { useState, useEffect, Fragment } from 'react';
import {useSelector} from 'react-redux'
import Styles from "./PluginFinder.module.css"
import {getLocalPluginData} from '../../storage/audioToolsDB'
import BarLoader from "../../UI/Loaders/BarLoader/BarLoader";
import AddAToolForm from "../AddATool/AddAToolForm";

const PluginFinder = () => {
  const {allTools} = useSelector((state) => state.toolsData);
  console.log('%c⚪️►►►► %cline:7%callTools', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(217, 104, 49);padding:3px;border-radius:2px', allTools)
  const acceptedPluginWrappers = ['vst','vst3','component']
  const [fileNames, setFileNames] = useState([]);
  const [addToLibrary, setAddToLibrary] = useState([])
  const [userFilesToGroomArray, setUserFilesToGroomArray] = useState(false)
  const [currentNameInSearch, setCurrentNameInSearch] = useState(true)
  const [findNewPlugins, setFindNewPlugins] = useState(false);
  

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


useEffect(()=>{
  console.log('%c⚪️►►►► %cline:77%caddToLibrary', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(38, 157, 128);padding:3px;border-radius:2px', addToLibrary)
},[addToLibrary])

////// HANDLERS////////////////////////////////////
const handleCheckBox = (e) => {
  e.preventDefault();
  const name = e.target.dataset.fileName
  if(addToLibrary.includes(name) ) {
    setAddToLibrary(prevState=>{
      const oldState = [...prevState]
      const newState = oldState.filter(item=>item!==name)
      return newState
    })
  }
    else {
      setAddToLibrary(prevState=>[...prevState, name])
    }
}

const handleToggleAllCheckBox = (e) => {
  e.preventDefault();
  if(addToLibrary.length>0) {
    setAddToLibrary([])
  }
    else {
      setAddToLibrary([...fileNames])
    }
}

const handleFindNewPluginsButton = (e)=>{
  setFindNewPlugins(!findNewPlugins)
}
const handleAddToLibraryButton =()=>{
  setUserFilesToGroomArray(addToLibrary.map(name=>[name,name]))
}

  ////////////////////////////////////////
  /// Styles
  ////////////////////////////////////////
  const submitButtonStyles = {
    position: "relative",
    top: "-0",
    left: "40%",
    width: "80%",
    transform: " translateX(-50%)",
    background: "var(--iq-color-accent-gradient)",
    borderRadius: "50px",
    height: "3em",
    font: "var(--iq-font-heading-2)",
  };

  const buttonStyles = {
    width: "80%",
    borderRadius: "50px",
    height: "3em",
    font: "var(--iq-font-heading-2)",
    fontSize: "1.5em",
    padding: "0",
    textTransform: "uppercase",
    fontWeight: "900",
    letterSpacing: "0.25em",
    textShadow:
      "rgb(0 0 0 / 50%) -1px -1px 1px, rgb(255 255 255 / 50%) 1px 1px 1px, 0 0 22px wheat",
  };


  ////////////////////////////////////////
  /// Output
  ////////////////////////////////////////
  return (
    <div className={Styles['plugin-finder-container']}>
   <button onClick={handleFindNewPluginsButton}>Find New Plugins</button>
   <button onClick={handleAddToLibraryButton}>Add to Library &rarr;</button>
      <ul>
         {currentNameInSearch &&
            <div key="loader" className={Styles["loader-wrap"]}>
              <BarLoader />
            </div>
          }
         
            <label htmlFor="select-all" onClick={handleToggleAllCheckBox}>   <input type="checkbox" name="select-all" />Select All</label>
        {findNewPlugins &&
        <Fragment>
          {fileNames.length > 0 && <h3>{fileNames.length}</h3>}
          {userFilesToGroomArray && (
                <div
                  key="add-a-tool-inputs-container 3"
                  className={Styles["inputs-container"]}
                >
                  <AddAToolForm
                    saveOrUpdateData="save"
                    formData={userFilesToGroomArray}
                    buttonStyles={buttonStyles}
                    submitButtonStyles={submitButtonStyles}
                  />
                </div>
          )}
          {fileNames.map((fileName, index) => (
              <li key={index}>

                <label htmlFor={fileName} onClick={handleCheckBox} data-file-name={fileName} >                <input type="checkbox" name={fileName}  data-file-name={fileName} defaultChecked={addToLibrary.includes(fileName)} checked={addToLibrary.includes(fileName)}/>
                {fileName}</label>
              </li>
            ))
          }
    </Fragment>
        }
      </ul>
    </div>
  );
}

export default PluginFinder