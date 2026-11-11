import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./PluginSearch.module.css";
import { audioToolDataActions } from "../../store/audioToolDataSlice";
import { hasActiveFilters } from "../../Hooks/SetFilteredToolList";

function PluginSearch() {
   const dispatch = useDispatch();
   const inputRef = useRef(null);
   const { allTools, currentFilters, filteredToolsIds, searchQuery } =
      useSelector((state) => state.toolsData);
   const [draft, setDraft] = useState(searchQuery || "");

   const totalCount = allTools
      ? Object.values(allTools).filter((tool) => tool && tool._id !== "error")
           .length
      : 0;
   const filtersOn = hasActiveFilters(currentFilters, searchQuery);
   const visibleCount = filtersOn
      ? (filteredToolsIds || []).length
      : totalCount;

   useEffect(() => {
      setDraft(searchQuery || "");
   }, [searchQuery]);

   useEffect(() => {
      const handle = setTimeout(() => {
         if ((searchQuery || "") !== draft) {
            dispatch(audioToolDataActions.setSearchQuery(draft));
         }
      }, 150);
      return () => clearTimeout(handle);
   }, [draft, dispatch, searchQuery]);

   useEffect(() => {
      const onKeyDown = (event) => {
         const key = event.key;
         const isSearchChord =
            (event.metaKey || event.ctrlKey) && key.toLowerCase() === "k";
         const isSlash =
            key === "/" &&
            event.target.tagName !== "INPUT" &&
            event.target.tagName !== "TEXTAREA";
         if (!isSearchChord && !isSlash) return;
         event.preventDefault();
         inputRef.current?.focus();
         inputRef.current?.select();
      };
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
   }, []);

   const toggleFavorite = () => {
      const isOn = (currentFilters?.favorite || []).length > 0;
      dispatch(
         audioToolDataActions.setFilterValues({
            type: "favorite",
            values: isOn ? [] : [true]
         })
      );
   };

   const toggleRated = () => {
      const isOn = (currentFilters?.rating || []).some(
         (value) => Number(value) >= 4
      );
      dispatch(
         audioToolDataActions.setFilterValues({
            type: "rating",
            values: isOn ? [] : [4]
         })
      );
   };

   const toggleActive = () => {
      const values = currentFilters?.status || [];
      const isOn = values.some(
         (value) => String(value).toLowerCase() === "active"
      );
      dispatch(
         audioToolDataActions.setFilterValues({
            type: "status",
            values: isOn ? [] : ["Active"]
         })
      );
   };

   const clearAll = () => {
      setDraft("");
      dispatch(audioToolDataActions.clearAllFilters());
   };

   return (
      <div className={styles.wrap}>
         <label className={styles.searchLabel} htmlFor="plugin-omnibox">
            Find a sound
         </label>
         <div className={styles.searchRow}>
            <input
               id="plugin-omnibox"
               ref={inputRef}
               className={styles.searchInput}
               type="search"
               value={draft}
               placeholder="Search name, company, notes, EQ, reverb…"
               onChange={(event) => setDraft(event.target.value)}
               autoComplete="off"
               spellCheck="false"
            />
            {draft && (
               <button
                  type="button"
                  className={styles.clearSearch}
                  onClick={() => {
                     setDraft("");
                     dispatch(audioToolDataActions.setSearchQuery(""));
                  }}
               >
                  Clear
               </button>
            )}
         </div>
         <div className={styles.metaRow}>
            <p className={styles.count}>
               {filtersOn
                  ? `${visibleCount} of ${totalCount} plugins`
                  : `${totalCount} plugins`}
            </p>
            <div className={styles.chips}>
               <button
                  type="button"
                  className={`${styles.chip} ${
                     (currentFilters?.favorite || []).length > 0
                        ? styles.chipOn
                        : ""
                  }`}
                  onClick={toggleFavorite}
               >
                  Favorites
               </button>
               <button
                  type="button"
                  className={`${styles.chip} ${
                     (currentFilters?.rating || []).some(
                        (value) => Number(value) >= 4
                     )
                        ? styles.chipOn
                        : ""
                  }`}
                  onClick={toggleRated}
               >
                  4★+
               </button>
               <button
                  type="button"
                  className={`${styles.chip} ${
                     (currentFilters?.status || []).some(
                        (value) => String(value).toLowerCase() === "active"
                     )
                        ? styles.chipOn
                        : ""
                  }`}
                  onClick={toggleActive}
               >
                  Active
               </button>
               {filtersOn && (
                  <button
                     type="button"
                     className={`${styles.chip} ${styles.chipClear}`}
                     onClick={clearAll}
                  >
                     Reset
                  </button>
               )}
            </div>
         </div>
         <p className={styles.hint}>Press / or ⌘K to search</p>
      </div>
   );
}

export default PluginSearch;
