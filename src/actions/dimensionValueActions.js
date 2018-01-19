import {
  ADD_DIMENSION_VALUE,
  FETCH_DIMENSION_VALUES,
  FETCH_DIMENSION_VALUES_FULFILLED,
  FETCH_DIMENSION_VALUES_REJECTED,
  REMOVE_DIMENSION_VALUE
} from "../constants/ActionTypes";

export const addDimensionValue = (seriesId, dimensionId, valueId) => ({
  type: ADD_DIMENSION_VALUE,
  payload: { seriesId, dimensionId, valueId }
});

export const fetchDimensionValues = (
  seriesId,
  dimensionId
) => async dispatch => {
  dispatch({
    type: FETCH_DIMENSION_VALUES,
    payload: {
      seriesId,
      dimensionId
    }
  });
  // TODO URLSearchParams is not supported in the jsdom version of
  // react-scripts 1.1.0. Change once jsdom is at v11 in react-scripts.
  // const params = new URLSearchParams();
  // `seriesId` and `dimensionId` are strings. API requires numbers.
  // params.append("serieID", parseInt(seriesId, 10));
  // params.append("dimensionID", parseInt(dimensionId, 10));
  // URL with interpolation:
  // `/DimensionValues/getAddValuesBySerie?${params.toString
  // Work around is OK for the time being since params do not contain chars that
  // need to be escaped.
  try {
    const response = await fetch(
      `/DimensionValues/getAddValuesBySerie?serieID=${parseInt(
        seriesId,
        10
      )}&dimensionID=${parseInt(dimensionId, 10)}`
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
      type: FETCH_DIMENSION_VALUES_FULFILLED,
      payload: {
        seriesId,
        dimensionId,
        values: data.map(dimensionValue =>
          (({ id, value }) => ({ id: id.toString(), value }))(dimensionValue)
        )
      }
    });
  } catch (e) {
    dispatch({
      type: FETCH_DIMENSION_VALUES_REJECTED,
      payload: {
        seriesId,
        dimensionId,
        error: { name: e.name, message: e.message }
      }
    });
  }
};

export const removeDimensionValue = (seriesId, dimensionId, valueId) => ({
  type: REMOVE_DIMENSION_VALUE,
  payload: { seriesId, dimensionId, valueId }
});
