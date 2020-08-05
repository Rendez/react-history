import { createContext } from "react";
import { history as historyType } from "./PropTypes";

const Context = createContext();

Context.Provider.propTypes = {
  value: historyType.isRequired,
};

export default Context;
