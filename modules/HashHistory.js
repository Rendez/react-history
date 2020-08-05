import React from "react";
import PropTypes from "prop-types";
import { createHashHistory } from "history";
import canUseDOM from "./canUseDOM";
import Context from "./Context";
/**
 * Manages session history using window.location.hash.
 */
class HashHistory extends React.Component {
  static propTypes = {
    basename: PropTypes.string,
    getUserConfirmation: PropTypes.func,
    hashType: PropTypes.oneOf(["hashbang", "noslash", "slash"]),
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  };

  constructor(props) {
    super(props);

    const { basename, getUserConfirmation, hashType } = this.props;

    if (canUseDOM) {
      this.history = createHashHistory({
        basename,
        getUserConfirmation,
        hashType,
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

export default HashHistory;
