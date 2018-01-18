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

export const fetchDimensionValues = (seriesId, dimensionId) => dispatch => {
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
  return fetch(
    `/DimensionValues/getAddValuesBySerie?serieID=${parseInt(
      seriesId,
      10
    )}&dimensionID=${parseInt(dimensionId, 10)}`
  )
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(
          new Error(
            `Request failed with status code ${response.status} (${
              response.statusText
            })`
          )
        );
      }
    })
    .then(data => {
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
    })
    .catch(error => {
      dispatch({
        type: FETCH_DIMENSION_VALUES_REJECTED,
        payload: {
          seriesId,
          dimensionId,
          error: { name: error.name, message: error.message }
        }
      });
    });
};

export const removeDimensionValue = (seriesId, dimensionId, valueId) => ({
  type: REMOVE_DIMENSION_VALUE,
  payload: { seriesId, dimensionId, valueId }
});
