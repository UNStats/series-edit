import { fetchDimensionValues } from "./dimensionValueActions";
import {
  ADD_DIMENSION,
  FETCH_DIMENSIONS,
  FETCH_DIMENSIONS_FULFILLED,
  FETCH_DIMENSIONS_REJECTED,
  REMOVE_DIMENSION
} from "../constants/ActionTypes";

export const addDimension = (seriesId, dimensionId) => dispatch => {
  // Dispatch ADD_DIMENSION sync. This creates new dimension with empty
  // `selectable` values. Then dispatch `fetchDimensionValues` async to fetch
  // values for `selectable`.
  dispatch({ type: ADD_DIMENSION, payload: { dimensionId } });
  return dispatch(fetchDimensionValues(seriesId, dimensionId));
};

export const removeDimension = dimensionId => ({
  type: REMOVE_DIMENSION,
  payload: { dimensionId }
});

// Fetch all potentially selectable dimensions for a series. Reducer figures out
// which dimensions are actually selectable.
export const fetchDimensions = seriesId => async dispatch => {
  dispatch({ type: FETCH_DIMENSIONS });
  // TODO See comment in dimensionValueActions.js.
  try {
    const response = await fetch(
      `/Dimensions/getAddDimensionBySerie?serieID=${parseInt(seriesId, 10)}`
    );
    if (!response.ok) {
      throw new Error(
        `Request failed with status code ${response.status} (${
          response.statusText
        })`
      );
    }
    const data = await response.json();
    // API returns IDs as numbers which have to be converted to strings.
    dispatch({
      type: FETCH_DIMENSIONS_FULFILLED,
      payload: {
        dimensions: data.map(dimension =>
          (({ id, value }) => ({ id: id.toString(), value }))(dimension)
        )
      }
    });
  } catch (e) {
    dispatch({
      type: FETCH_DIMENSIONS_REJECTED,
      payload: {
        error: { name: e.name, message: e.message }
      }
    });
  }
};
