import syles from "./PushButton.module.css";
import { Fragment } from "react";

function PushButton(props) {
  let output;
  if (props.inputOrButton === "button") {
    output = (
      <Fragment>
        <button
          className={
            syles["button"] +
            " " +
            syles[props.colorType] +
            " " +
            syles[props.size] +
            " " +
            syles[props.active] +
            " " +
            syles[props.selected]
          }
          style={props.styles}
          id={props.id}
          value={props.value}
          data-data={props.data}
          onClick={props.onClick}
        >
          {props.children}
        </button>
      </Fragment>
    );
  } else {
    output = (
      <Fragment>
        <label htmlFor={props.name}>{props.label}</label>
        <input
          key={props.name}
          className={
            syles["button"] +
            " " +
            syles[props.colorType] +
            " " +
            syles[props.size] +
            " " +
            syles[props.active] +
            " " +
            syles[props.selected]
          }
          style={props.styles}
          type={props.type}
          name={props.name}
          value={props.value}
          onClick={props.onClick}
        />
      </Fragment>
    );
  }

  return <Fragment>{output}</Fragment>;
}

export default PushButton;
