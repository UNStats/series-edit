import { combineReducers } from "redux";
import title from "./titleReducer";
import code from "./codeReducer";
import disabled from "./disabledReducer";
import dirty from "./dirtyReducer";
import dimensions from "./dimensionsReducer";

export default combineReducers({
  title,
  code,
  disabled,
  dirty,
  dimensions
});
