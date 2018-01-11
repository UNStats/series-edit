import axios from "axios"
import {fetchDimensionValues} from "./dimensionValueActions"
import {
  ADD_DIMENSION,
  FETCH_DIMENSIONS,
  FETCH_DIMENSIONS_FULFILLED,
  FETCH_DIMENSIONS_REJECTED,
  REMOVE_DIMENSION
} from "../constants/ActionTypes"

export const addDimension = (seriesId, dimensionId) => dispatch => {
  // Dispatch ADD_DIMENSION (sync) with `selectable` empty.
  dispatch({type: ADD_DIMENSION, payload: {seriesId, dimensionId}})
  // Then dispatch `fetchDimensionValues` async to populate `selectable`.
  return dispatch(fetchDimensionValues(seriesId, dimensionId))
}

// Action creator to fetch all potentially selectable dimensions for a series.
// Reducer figures out out which dimensions are actually selectable.
export const fetchDimensions = seriesId => dispatch => {
  dispatch({type: FETCH_DIMENSIONS, payload: {seriesId}})
  return (
    axios
      // `seriesId` is string, but API requires number.
      .post("/Dimensions/getAddDimensionBySerie", {
        serieID: parseInt(seriesId, 10)
      })
      .then(response => {
        // API returns IDs a number.
        dispatch({
          type: FETCH_DIMENSIONS_FULFILLED,
          payload: {
            seriesId,
            values: response.data.map(dimension =>
              (({id, value}) => ({id: id.toString(), value}))(dimension)
            )
          }
        })
      })
      .catch(error => {
        dispatch({
          type: FETCH_DIMENSIONS_REJECTED,
          payload: {
            seriesId,
            error: {name: error.name, message: error.message}
          }
        })
      })
  )
}

export const removeDimension = (seriesId, dimensionId) => ({
  type: REMOVE_DIMENSION,
  payload: {seriesId, dimensionId}
})
