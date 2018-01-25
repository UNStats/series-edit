import {
  SAVE_SERIES,
  SAVE_SERIES_FULFILLED,
  SAVE_SERIES_REJECTED
} from "../constants/ActionTypes";

export const saveSeries = (seriesId, token) => async (dispatch, getState) => {
  dispatch({ type: SAVE_SERIES });

  const dataToBeSaved = new window.FormData();
  const { title, code, dimensions } = getState();
  // Assemble data to be saved for post request. All request does is submit IDs
  // of selected dimension values together with info about the series.
  dataToBeSaved.append("ID", seriesId);
  dataToBeSaved.append("Title", title);
  dataToBeSaved.append("Code", code);
  dataToBeSaved.append("__RequestVerificationToken", token);
  dimensions.selected.forEach(selectedDimension => {
    selectedDimension.selected.forEach(selectedValue => {
      dataToBeSaved.append("DimensionValue", parseInt(selectedValue.id, 10));
    });
  });

  try {
    const response = await fetch(`/Series/Edit/${seriesId}`, {
      method: "post",
      body: dataToBeSaved
    });
    if (!response.ok) {
      throw new Error(
        `Request failed with status code ${response.status} (${
          response.statusText
        })`
      );
    }
    dispatch({ type: SAVE_SERIES_FULFILLED });
  } catch (e) {
    dispatch({
      type: SAVE_SERIES_REJECTED,
      payload: {
        error: { name: e.name, message: e.message }
      }
    });
  }
};
