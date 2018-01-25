import {
  FETCH_DIMENSIONS_FULFILLED,
  SAVE_SERIES,
  SAVE_SERIES_FULFILLED,
  SAVE_SERIES_REJECTED
} from "../constants/ActionTypes";

const disabledReducer = (state = false, action) => {
  switch (action.type) {
    case FETCH_DIMENSIONS_FULFILLED: {
      // `disabled` is set to true in preloaded state.
      // Enable component only after fetching dimensions is completed.
      return false;
    }
    case SAVE_SERIES: {
      return true;
    }
    case SAVE_SERIES_FULFILLED: {
      return false;
    }
    case SAVE_SERIES_REJECTED: {
      // Do not keep component locked if saving fails.
      return false;
    }
    default: {
      return state;
    }
  }
};

export default disabledReducer;
