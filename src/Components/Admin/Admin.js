import styles from "./Admin.module.css";
import { useState } from "react";
import ImageDownload from "./ImageDownload";
import SetImageURLS from "./SetImageURLS";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

const Admin = (props) => {
  const [showImageDownload, setShowImageDownload] = useState(false);
  const [setImageURLS, setSetImageURLS] = useState(false);

  const downloadPicsButtonHandler = () => {
    setShowImageDownload(!showImageDownload);
  };
  const setImageURLSButtonHandler = () => {
    setSetImageURLS(!setImageURLS);
  };
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
