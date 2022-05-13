import { useState, useEffect, useRef, Fragment } from "react";
import styles from "./CollapsibleElm.module.css";
import PushButton from "../../UI/Buttons/PushButton/PushButton";

function CollapsibleElm(props) {
  const [elmOpen, setElmOpen] = useState(props.open);
  const [overflowActive, setOverflowActive] = useState(false);
  const textRef = useRef();

  // See if div is overflowing and Se More button is needed
  function isOverflowActive(e) {
    return e.offsetHeight < e.scrollHeight || e.offsetWidth < e.scrollWidth;
  }

  useEffect(() => {
    if (isOverflowActive(textRef.current)) {
      setOverflowActive(true);
      return;
    }

    setOverflowActive(false);
  }, [isOverflowActive]);

  const seeMoreButtonHandler = (e) => {
    setElmOpen(!elmOpen);
  };

  // This allows the elm to be opened without a click by setting the open props
  useEffect(() => {
    setElmOpen(props.open);
  }, [props.open]);

  let output;

  let elmOpenStyles;
  let seeMoreButtonText;

  if (elmOpen) {
    elmOpenStyles = { maxHeight: "100000px", ...props.styles };
    seeMoreButtonText = <span>&uarr; See Less &uarr;</span>;
  } else {
    elmOpenStyles = { maxHeight: props.maxHeight, ...props.styles };
    seeMoreButtonText = <span>&darr; See More &darr;</span>;
  }

  output = (
    <Fragment key={props.elmId}>
      <div
        ref={textRef}
        className={styles["collapsible-elm"]}
        style={elmOpenStyles}
      >
        {props.children}
      </div>
      {!elmOpen && !overflowActive ? null : (
        <PushButton
          inputOrButton={props.inputOrButton}
          styles={props.buttonStyles}
          id={props.elmId + "-see-more-btn"}
          colorType={props.colorType}
          value={seeMoreButtonText}
          data={props.data}
          size={props.size}
          onClick={seeMoreButtonHandler}
        >
          {seeMoreButtonText}
        </PushButton>
      )}
    </Fragment>
  );

  return output;
}

export default CollapsibleElm;
