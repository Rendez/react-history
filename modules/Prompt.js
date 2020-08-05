import React from "react";
import PropTypes from "prop-types";
import canUseDOM from "./canUseDOM";
import Context from "./Context";

class Prompt extends React.Component {
  static propTypes = {
    when: PropTypes.bool,
    message: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  };

  static defaultProps = {
    when: true,
  };

  static contextType = Context;

  constructor(props, context) {
    super(props, context);

    if (canUseDOM) {
      if (this.props.when) {
        this.enable(this.props.message);
      }
    }
  }

  enable(message) {
    if (this.unblock) this.unblock();
    this.unblock = this.context.block(message);
  }

  disable() {
    if (this.unblock) {
      this.unblock();
      this.unblock = null;
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.when) {
      if (!prevProps.when || prevProps.message !== this.props.message)
        this.enable(this.props.message);
    } else {
      this.disable();
    }
    return null;
  }

  componentWillUnmount() {
    this.disable();
  }

  render() {
    return null;
  }
}

export default Prompt;
