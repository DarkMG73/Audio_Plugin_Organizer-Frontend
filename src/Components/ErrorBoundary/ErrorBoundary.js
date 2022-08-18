import { Component } from "react";
import styles from "./ErrorBoundary.module.css";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.log("Error Logging -->", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <h1>
          ****************** Oh No! Something Went Wrong!! ******************
        </h1>
      );
    }

    return (
      <>
        {/** Use other props passed to wrapper **/}
        {this.props.hasError && <h1>Something went wrong.</h1>}

        <div>
          <h2>SPECIAL PROPS </h2>
          {this.props.specialProps}
        </div>
        {this.props.children}
      </>
    );
  }
}
