import styles from "./Admin.module.css";
import { useState } from "react";
import ImageDownload from "./ImageDownload";
import SetImageURLS from "./SetImageURLS";

const Admin = (props) => {
  const [showImageDownload, setShowImageDownload] = useState(false);
  const [setImageURLS, setSetImageURLS] = useState(false);

  ///////////////////////////////////////////////////////////////////////
  /// Handlers
  ///////////////////////////////////////////////////////////////////////
  const downloadPicsButtonHandler = () => {
    setShowImageDownload(!showImageDownload);
  };

  const setImageURLSButtonHandler = () => {
    setSetImageURLS(!setImageURLS);
  };

  ///////////////////////////////////////////////////////////////////////
  /// Output
  ///////////////////////////////////////////////////////////////////////
  return (
    <div className={styles["admin-container"]}>
      <h2 key="home" className="section-title">
        Admin Tools
      </h2>

      <button onClick={downloadPicsButtonHandler}>Download Pics</button>
      {showImageDownload && <ImageDownload />}
      <button onClick={setImageURLSButtonHandler}>Set IMage URL's</button>
      {setImageURLS && <SetImageURLS />}
    </div>
  );
};

export default Admin;
