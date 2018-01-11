import {combineReducers} from "redux"
import dimensionsReducer from "./dimensionsReducer"
import seriesReducer from "./seriesReducer"

export default combineReducers({
  dimensions: dimensionsReducer,
  series: seriesReducer
})
