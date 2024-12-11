import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './ToolsRowsList.module.css';
import ToolsRows from '../ToolsRows/ToolsRows';
import { audioToolDataActions } from '../../../store/audioToolDataSlice';
import LoginStatus from '../../User/LoginStatus/LoginStatus';
import BarLoader from '../../../UI/Loaders/BarLoader/BarLoader';
import PluginFinder from '../../PluginFinder/PluginFinder';

function ToolsRowsList(props) {
  const [toolsAreReady, setToolsAreReady] = useState(false);
  const { allTools, filteredToolsIds, currentFilters, goToToolRows } =
    useSelector((state) => state.toolsData);

  const user = useSelector((state) => state.auth.user);
  const toolListRef = useRef();
  const dispatch = useDispatch;

  ////////////////////////////////////////
  /// EFFECTS
  ////////////////////////////////////////
  useEffect(() => {
    if (allTools) {
      setToolsAreReady(true);
    } else {
      setToolsAreReady(false);
    }
  }, [allTools]);

  useEffect(() => {
    if (goToToolRows > 0)
      toolListRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [goToToolRows]);
  // useEffect(() => {
  //   props.setScrollToToolsRowsList(sessionResultsBox);
  // }, []);

  ////////////////////////////////////////
  /// FUNCTIONALITY
  ////////////////////////////////////////
  let toolsToDisplay = {};
  if (toolsAreReady) toolsToDisplay = { ...allTools };

  if (toolsAreReady && filteredToolsIds.length > 0) {
    toolsToDisplay = {};
    filteredToolsIds.forEach((id) => {
      toolsToDisplay[id] = allTools[id];
    });
  }

  let noQuestionsMessage = (
    <p>
      You do not have a history yet on this browser. Answer a few items and they
      will be saved to this browser's memory. This history will remain available
      until you decide to erase it.
    </p>
  );

  let filtersAreSet = false;
  if (toolsAreReady && filteredToolsIds.length <= 0) {
    Object.keys(currentFilters).forEach((filterName) => {
      if (currentFilters[filterName].length > 0) {
        toolsToDisplay = {};
        filtersAreSet = true;
      }
    });
    if (filtersAreSet) {
      noQuestionsMessage = (
        <p>
          We can not find any plugins or tools using all of the filters you have
          selected. Try removing some of the filters and we will see if that
          helps.
        </p>
      );
    }
  }

  ////////////////////////////////////////
  /// FUNCTIONALITY
  ////////////////////////////////////////
  const addAToolButtonHandler = () => {
    dispatch(audioToolDataActions.goToAddATool());
  };

  ////////////////////////////////////////
  /// OUTPUT
  ////////////////////////////////////////
  return (
    <div
      key="toolsrowsList-1"
      id="tool-row-list"
      className={styles['tool-row-list']}
    >
      <div className={styles['header-container']}>
        <h2 key="home" className="section-title">
          Production Plugins{' '}
          <span className={styles['special-character']}>&</span> Tools List
        </h2>
      </div>
      <div className={styles['add-a-tool-wrap']}>
        {!toolsAreReady && <BarLoader />}
        {toolsAreReady && (
          <LoginStatus
            horizontalDisplay={false}
            showAddAToolButton={false}
            signUpButtonStyles={{
              background:
                'linear-gradient(var(--iq-color-accent) 37%, rgba(0, 0, 0, 1) 100%)',
              color: 'var(--iq-color-foreground)',
              textShadow: '0 0 3px wheat',
              fontSize: '1em',
              borderRadius: '50px',
              height: '2em',
              padding: '0.25em 2em 0.5em',
              lineHeight: '1em',
            }}
          />
        )}
      </div>
      <PluginFinder />
      <div
        key={'tool-list-wrap-key'}
        className={styles['tool-list-wrap']}
        ref={toolListRef}
      >
        {!toolsAreReady && <BarLoader />}
        {toolsAreReady && (
          <ToolsRows
            key="toolsrowsList-4"
            allTools={allTools}
            toolsToDisplay={toolsToDisplay}
            filteredToolsIds={filteredToolsIds}
            showLoader={props.showLoader}
            noQuestionsMessage={noQuestionsMessage}
          />
        )}
      </div>
    </div>
  );
}

export default ToolsRowsList;
