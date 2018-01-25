import reducer from "./disabledReducer";
import {
  FETCH_DIMENSIONS_FULFILLED,
  SAVE_SERIES,
  SAVE_SERIES_FULFILLED,
  SAVE_SERIES_REJECTED
} from "../constants/ActionTypes";

describe("disabledReducer", () => {
  test("initial state", () => {
    expect(reducer(undefined, {})).toEqual(false);
  });

  describe("invalid action", () => {
    test("state is true", () => {
      expect(reducer(true, { type: "INVALID_ACTION" })).toEqual(true);
    });

    test("state is false", () => {
      expect(reducer(false, { type: "INVALID_ACTION" })).toEqual(false);
    });
  });

  test("FETCH_DIMENSIONS_FULFILLED", () => {
    expect(reducer(true, { type: FETCH_DIMENSIONS_FULFILLED })).toEqual(false);
  });

  test("SAVE_SERIES", () => {
    expect(reducer(false, { type: SAVE_SERIES })).toEqual(true);
  });

  test("SAVE_SERIES_FULFILLED", () => {
    expect(reducer(true, { type: SAVE_SERIES_FULFILLED })).toEqual(false);
  });

  test("SAVE_SERIES_REJECTED", () => {
    expect(reducer(true, { type: SAVE_SERIES_REJECTED })).toEqual(false);
  });
});
