import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import styles from './AddATool.module.css';
import PushButton from '../../UI/Buttons/PushButton/PushButton';
import AddAToolForm from './AddAToolForm';

import CSVReader from './CSVReader/CSVReader';
import LoginStatus from '../User/LoginStatus/LoginStatus';
import AudioPluginSelector from '../AudioPluginSelector/AudioPluginSelector';
import BarLoader from '../../UI/Loaders/BarLoader/BarLoader';

function AddATool(props) {
  const { allTools, goToAddATool } = useSelector((state) => state.toolsData);
  const user = useSelector((state) => state.auth.user);
  const [showAddQuestionForm, setShowAddQuestionForm] = useState(false);
  const [showAddFromLibrary, setShowAddFromLibrary] = useState(false);
  const [fileUploadArray, setFileUploadArray] = useState(false);
  const doNotShowTitle = props.doNotShowTitle;
  const doNotShowWelcomeMessage = props.doNotShowWelcomeMessage;
  const doNotShowAddButtons = props.doNotShowAddButtons;
  const doNotShowLogin = props.doNotShowLogin;
  const addAToolRef = useRef();

  ////////////////////////////////////////
  /// EFFECTS
  ////////////////////////////////////////
  useEffect(() => {
    if (goToAddATool && goToAddATool > 0)
      addAToolRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [goToAddATool]);

  ////////////////////////////////////////
  /// HANDLERS
  ////////////////////////////////////////
  function showNewQuestionFormButtonHandler() {
    setShowAddQuestionForm(!showAddQuestionForm);
  }
  function showAudioPluginSelectorButtonHandler() {
    setShowAddFromLibrary(!showAddFromLibrary);
  }

  ////////////////////////////////////////
  /// Styles
  ////////////////////////////////////////
  const submitButtonStyles = {
    position: 'relative',
    top: '-0',
    left: '40%',
    width: '80%',
    transform: ' translateX(-50%)',
    background: 'var(--iq-color-accent-gradient)',
    borderRadius: '50px',
    height: '3em',
    font: 'var(--iq-font-heading-2)',
  };

  const buttonStyles = {
    width: '80%',
    borderRadius: '50px',
    height: '3em',
    font: 'var(--iq-font-heading-2)',
    fontSize: '1.5em',
    padding: '0',
    textTransform: 'uppercase',
    fontWeight: '900',
    letterSpacing: '0.25em',
    textShadow:
      'rgb(0 0 0 / 50%) -1px -1px 1px, rgb(255 255 255 / 50%) 1px 1px 1px, 0 0 22px wheat',
  };

  let audioPluginLibraryButtonStyles = {};
  if (showAddFromLibrary)
    audioPluginLibraryButtonStyles = {
      boxShadow: 'inset 0 0 47px -7px var(--iq-color-accent)',
    };

  ////////////////////////////////////////
  /// OUTPUT
  ////////////////////////////////////////
  return (
    <div
      key="add-a-tool"
      id="add-a-tool-outer-wrap"
      className={
        styles['add-a-tool-outer-wrap'] + ' ' + 'add-a-tool-outer-wrap'
      }
      ref={addAToolRef}
    >
      <div
        key="add-a-tool-container"
        id="add-a-tool-container"
        className={
          styles['add-a-tool-container'] + ' ' + 'add-a-tool-container'
        }
      >
        {!doNotShowTitle && <h2 className="section-title">Add A Tool Here</h2>}
        {!allTools && <BarLoader key="bar-loader" />}
        {allTools && !doNotShowWelcomeMessage && (
          <p className={styles['add-a-tool-intro'] + ' ' + 'add-a-tool-intro'}>
            To add an item, simply click the <i>Show the Entry Form</i> button
            and fill out the small form. Feel free to click the "Add Another
            Form" button to create as many forms as needed to add multiple items
            at once. When they are all ready, click the <i>Submit</i> button.
          </p>
        )}

        {allTools && !doNotShowLogin && (
          <div
            key="add-a-tool-db-login-container"
            id="db-login-container"
            className={`${styles['inner-wrap']}  ${styles['db-login-status-container']} 'inner-wrap' 'db-login-status-container'`}
          >
            <LoginStatus key="login-status" />
            {!user && (
              <div
                key="add-a-tool-form-container"
                className={`${styles['not-logged-in-error']} ${styles['form-container']} 'not-logged-in-error' 'form-container'`}
              >
                <p>
                  You must be logged in to access or submit production tools to
                  the database. If you do not have an account, the entry form
                  will be emailed to the site admin for review before it is
                  entered into he database .
                </p>
              </div>
            )}
          </div>
        )}
        {allTools && !doNotShowAddButtons && (
          <div
            key="add-a-tool-section-container"
            className={
              styles['button-section-container'] +
              ' ' +
              'button-section-container'
            }
          >
            <div
              key="add-a-tool-button-container 1"
              className={styles['button-container'] + ' ' + 'button-container'}
            >
              <PushButton
                key="add-a-tool-form-library-button"
                inputOrButton="button"
                id="create-entry-btn"
                colorType="secondary"
                value="Add a Question"
                data=""
                size="medium"
                onClick={showAudioPluginSelectorButtonHandler}
                styles={audioPluginLibraryButtonStyles}
              >
                {showAddFromLibrary && (
                  <span>
                    <b>CLOSE</b> <br />
                    the Library
                  </span>
                )}
                {!showAddFromLibrary && (
                  <span>Add from the Plugins & Tools Library</span>
                )}
              </PushButton>
            </div>
            <div
              key="add-a-tool-button-container 2"
              className={styles['button-container'] + ' ' + 'button-container'}
            >
              <PushButton
                inputOrButton="button"
                id="create-entry-btn"
                colorType="secondary"
                value="Add a Question"
                data=""
                size="medium"
                onClick={showNewQuestionFormButtonHandler}
              >
                {showAddQuestionForm && (
                  <span>
                    <b>Cancel</b> the Manual Entry Form
                  </span>
                )}
                {!showAddQuestionForm && <span>Manual Entry Form</span>}
              </PushButton>
            </div>{' '}
            <div
              key="add-a-tool-button-container 3"
              className={styles['button-container'] + ' ' + 'button-container'}
            >
              <div
                className={
                  styles['cvs-buttons-container'] +
                  ' ' +
                  'cvs-buttons-container'
                }
              >
                <CSVReader setFileUploadArray={setFileUploadArray} />
              </div>
            </div>
          </div>
        )}

        {showAddFromLibrary && (
          <div
            key="add-a-tool-inputs-container 1"
            className={styles['inputs-container'] + ' ' + 'inputs-container'}
          >
            <AudioPluginSelector showAddFromLibrary={showAddFromLibrary} />
          </div>
        )}
        {showAddQuestionForm && (
          <div
            key="add-a-tool-inputs-container 2"
            className={styles['inputs-container'] + ' ' + 'inputs-container'}
          >
            <AddAToolForm
              saveOrUpdateData="save"
              buttonStyles={buttonStyles}
              submitButtonStyles={submitButtonStyles}
              setFormParentOpen={setShowAddQuestionForm}
            />
          </div>
        )}
        {fileUploadArray && (
          <div
            key="add-a-tool-inputs-container 3"
            className={styles['inputs-container'] + ' ' + 'inputs-container'}
          >
            <AddAToolForm
              saveOrUpdateData="save"
              formData={fileUploadArray}
              buttonStyles={buttonStyles}
              submitButtonStyles={submitButtonStyles}
              setFormParentOpen={setShowAddQuestionForm}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default AddATool;
