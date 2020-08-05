import React from "react";
import PropTypes from "prop-types";
import { createBrowserHistory } from "history";
import canUseDOM from "./canUseDOM";
import Context from "./Context";

/**
 * Manages session history using the HTML5 history API including
 * pushState, replaceState, and the popstate event.
 */
class BrowserHistory extends React.Component {
  static propTypes = {
    basename: PropTypes.string,
    forceRefresh: PropTypes.bool,
    getUserConfirmation: PropTypes.func,
    keyLength: PropTypes.number,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  };

  constructor(props) {
    super(props);

    if (canUseDOM) {
      const {
        basename,
        forceRefresh,
        getUserConfirmation,
        keyLength,
      } = this.props;

      this.history = createBrowserHistory({
        basename,
        forceRefresh,
        getUserConfirmation,
        keyLength,
      });

      // Do this here so we catch actions in cDM.
      this.unlisten = this.history.listen(() => this.forceUpdate());
    } else {
      this.history = {};
    }
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    const { children } = this.props;

    return (
      <Context.Provider value={this.history}>
        {typeof children === "function"
          ? children(this.history)
          : React.Children.only(children)}
      </Context.Provider>
    );
  }
}

export default BrowserHistory;
