import { Component } from "react";
import styles from "./ErrorBoundary.module.css";
import CardPrimary from "../../../UI/Cards/CardPrimary/CardPrimary";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: "", errorInfo: "" };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error: error,
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      hasError: true,
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <CardPrimary
          styles={{
            boxShadow:
              "inset 4px 4px 14px -7px rgb(255 255 255), inset -4px -4px 14px -7px rgb(0 0 0 / 50%), 0 0 30px var(--iq-color-accent)",
            margin: "30px auto",
          }}
        >
          <div className={styles["error-container"]}>
            <h1>Oh No! This component is not working!</h1>
            <h2>Gremlins must have messed with the wires!</h2>
            <div className={styles["error-text-container"]}>
              <p>
                Sorry about this. :( Something did not quite work right. Make
                sure the browser is connected to the internet and any firewalls
                are not preventing this app from reaching out to the database.
                Then refresh the browser and see if thr worker elves kicked
                those gremlins' behinds outta here!
              </p>
              <p>
                {" "}
                if the problem continues, please send a quick email so this can
                be looked into
              </p>{" "}
              Click this link for a fully populated and ready-to-send email.
              <a
                href={`mailto:general@glassinteractive.com.com?body=${encodeURIComponent(
                  "Hello! an error has occured on the Production Tools Organizer: " +
                    this.state.error.toString() +
                    " ||| " +
                    this.state.errorInfo.componentStack
                )}`}
              >
                Send the email {"\u2B95"}
              </a>
              <p>The error: {this.state.error.toString()}</p>
            </div>
          </div>
        </CardPrimary>
      );
    }

    return <>{this.props.children}</>;
  }
}
