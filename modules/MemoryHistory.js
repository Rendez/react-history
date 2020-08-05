import React from "react";
import PropTypes from "prop-types";
import { createMemoryHistory } from "history";
import canUseDOM from "./canUseDOM";
import Context from "./Context";

/**
 * Manages session history using in-memory storage.
 */
class MemoryHistory extends React.Component {
  static propTypes = {
    getUserConfirmation: PropTypes.func,
    initialEntries: PropTypes.array,
    initialIndex: PropTypes.number,
    keyLength: PropTypes.number,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  };

  constructor(props) {
    super(props);

    if (canUseDOM) {
      const {
        getUserConfirmation,
        initialEntries,
        initialIndex,
        keyLength,
      } = this.props;

      this.history = createMemoryHistory({
        getUserConfirmation,
        initialEntries,
        initialIndex,
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

export default MemoryHistory;
