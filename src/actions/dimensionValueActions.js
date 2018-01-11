import axios from "axios"
import {
  ADD_DIMENSION_VALUE,
  FETCH_DIMENSION_VALUES,
  FETCH_DIMENSION_VALUES_FULFILLED,
  FETCH_DIMENSION_VALUES_REJECTED,
  REMOVE_DIMENSION_VALUE
} from "../constants/ActionTypes"

export const addDimensionValue = (seriesId, dimensionId, valueId) => ({
  type: ADD_DIMENSION_VALUE,
  payload: {seriesId, dimensionId, valueId}
})

export const fetchDimensionValues = (seriesId, dimensionId) => dispatch => {
  dispatch({
    type: FETCH_DIMENSION_VALUES,
    payload: {
      seriesId,
      dimensionId
    }
  })
  // API spells "series" as "serie".
  return (
    axios
      // `seriesId` and `dimensionId` are strings.
      // Need to be converted to numbers for API call.
      .post("/DimensionValues/getAddValuesBySerie", {
        serieID: parseInt(seriesId, 10),
        dimensionID: parseInt(dimensionId, 10)
      })
      .then(response => {
        dispatch({
          type: FETCH_DIMENSION_VALUES_FULFILLED,
          payload: {
            seriesId,
            dimensionId,
            // API delivers IDs as numbers. Convert to strings.
            values: response.data.map(dimensionValue =>
              (({id, value}) => ({id: id.toString(), value}))(dimensionValue)
            )
          }
        })
      })
      .catch(error => {
        dispatch({
          type: FETCH_DIMENSION_VALUES_REJECTED,
          payload: {
            seriesId,
            dimensionId,
            error: {name: error.name, message: error.message}
          }
        })
      })
  )
}

export const removeDimensionValue = (seriesId, dimensionId, valueId) => ({
  type: REMOVE_DIMENSION_VALUE,
  payload: {seriesId, dimensionId, valueId}
})
