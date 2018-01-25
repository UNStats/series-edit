import {
  ADD_DIMENSION,
  REMOVE_DIMENSION,
  ADD_DIMENSION_VALUE,
  REMOVE_DIMENSION_VALUE,
  SAVE_SERIES,
  SAVE_SERIES_REJECTED
} from "../constants/ActionTypes";

const dirtyReducer = (state = false, action) => {
  switch (action.type) {
    case ADD_DIMENSION: {
      return true;
    }
    case REMOVE_DIMENSION: {
      return true;
    }
    case ADD_DIMENSION_VALUE: {
      return true;
    }
    case REMOVE_DIMENSION_VALUE: {
      return true;
    }
    case SAVE_SERIES: {
      return false;
    }
    case SAVE_SERIES_REJECTED: {
      return true;
    }
    default: {
      return state;
    }
  }
};

export default dirtyReducer;
