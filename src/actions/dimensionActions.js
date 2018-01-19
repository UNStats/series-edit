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
  dispatch({ type: ADD_DIMENSION, payload: { seriesId, dimensionId } });
  return dispatch(fetchDimensionValues(seriesId, dimensionId));
};

// Fetch all potentially selectable dimensions for a series. Reducer figures out
// which dimensions are actually selectable.
export const fetchDimensions = seriesId => async dispatch => {
  dispatch({ type: FETCH_DIMENSIONS, payload: { seriesId } });
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
        seriesId,
        values: data.map(dimension =>
          (({ id, value }) => ({ id: id.toString(), value }))(dimension)
        )
      }
    });
  } catch (e) {
    dispatch({
      type: FETCH_DIMENSIONS_REJECTED,
      payload: {
        seriesId,
        error: { name: e.name, message: e.message }
      }
    });
  }
};

export const removeDimension = (seriesId, dimensionId) => ({
  type: REMOVE_DIMENSION,
  payload: { seriesId, dimensionId }
});
