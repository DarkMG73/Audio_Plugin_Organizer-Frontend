import { useState, useEffect } from "react";
import Styles from "./AppThemeSwitcher.module.css";
import storage from "../../storage/storage";
import "./appColorThemes/appColorThemeOne.css";
import "./appColorThemes/appColorThemeTwo.css";

const AppThemeSwitcher = () => {
   const [savedTheme, setSavedTheme] = useState(false);

   const themeOptions = {
      themeOne: "Steel Theme",
      themeTwo: "Night Theme"
   };

   const handleThemeChange = (e) => {
      for (const key of Object.keys(themeOptions)) {
         document.body.classList.remove(key);
      }
      document.body.classList.add(e.target.value);
      // const confirm = window.confirm(
      //   'Do you want to change the theme and reload the Audio Plugin Organizer? If so, be sure to save any unsaved data before you do so.',
      // );
      // if (confirm) {
      storage("ADD", { appTheme: e.target.value }, "appTheme", false);
      // }
   };

   // useEffect(() => {
   //   const themeSelection = storage('GET', {}, 'appTheme');

   //   if (!themeSelection || !themeSelection.appTheme) {
   //     /* eslint-disable-next-line import/no-dynamic-require,global-require */
   //     require(`./appColorThemes/${Object.keys(themeOptions)[0]}`);
   //     setSavedTheme(Object.keys(themeOptions)[0]);
   //   } else {
   //     /* eslint-disable-next-line import/no-dynamic-require,global-require */
   //     require(`./appColorThemes/${themeSelection.appTheme}`);
   //     setSavedTheme(themeSelection.appTheme);
   //   }
   // }, []);

   useEffect(() => {
      const themeSelection = storage("GET", {}, "appTheme");

      if (!themeSelection || !themeSelection.appTheme) {
         document.body.classList.add(Object.keys(themeOptions)[1]);
         setSavedTheme(Object.keys(themeOptions)[0]);
      } else {
         document.body.classList.add(themeSelection.appTheme);
         setSavedTheme(themeSelection.appTheme);
      }
   }, []);

   return (
      <div>
         <div className={Styles["button-wrap"]}>
            <select name="theme" onChange={handleThemeChange}>
               {Object.entries(themeOptions).map((entry) => (
                  <option
                     key={entry[0]}
                     value={entry[0]}
                     selected={entry[0] === savedTheme}
                  >
                     {entry[1]}
                  </option>
               ))}
            </select>
         </div>
      </div>
   );
};

export default AppThemeSwitcher;
