import {
  SAVE_SERIES,
  SAVE_SERIES_FULFILLED,
  SAVE_SERIES_REJECTED
} from "../constants/ActionTypes";

export const saveSeries = seriesId => async (dispatch, getState) => {
  dispatch({ type: SAVE_SERIES, payload: { seriesId } });

  const dataToBeSaved = new window.FormData();
  const { series, dimensions } = getState();
  // Assemble data to be saved for post request. All request does is submit IDs
  // of selected dimension values together with info about the series.
  dataToBeSaved.append("ID", series.id);
  dataToBeSaved.append("Title", series.title);
  dataToBeSaved.append("Code", series.code);
  dataToBeSaved.append("__RequestVerificationToken", seriesId.token);
  dimensions.selected.forEach(selectedDimension => {
    selectedDimension.selected.forEach(selectedValue => {
      dataToBeSaved.append("DimensionValue", parseInt(selectedValue.id, 10));
    });
  });

  try {
    const response = await fetch(`/Series/Edit/${series.id}`, {
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
    dispatch({ type: SAVE_SERIES_FULFILLED, payload: { seriesId } });
  } catch (e) {
    dispatch({
      type: SAVE_SERIES_REJECTED,
      payload: {
        seriesId,
        error: { name: e.name, message: e.message }
      }
    });
  }
};
