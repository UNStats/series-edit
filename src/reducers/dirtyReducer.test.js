import reducer from "./dirtyReducer";
import {
  ADD_DIMENSION,
  REMOVE_DIMENSION,
  ADD_DIMENSION_VALUE,
  REMOVE_DIMENSION_VALUE,
  SAVE_SERIES,
  SAVE_SERIES_REJECTED
} from "../constants/ActionTypes";

describe("dirtyReducer", () => {
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

  test("ADD_DIMENSION", () => {
    expect(reducer(false, { type: ADD_DIMENSION })).toEqual(true);
  });

  test("REMOVE_DIMENSION", () => {
    expect(reducer(false, { type: REMOVE_DIMENSION })).toEqual(true);
  });

  test("ADD_DIMENSION_VALUE", () => {
    expect(reducer(false, { type: ADD_DIMENSION_VALUE })).toEqual(true);
  });

  test("REMOVE_DIMENSION_VALUE", () => {
    expect(reducer(false, { type: REMOVE_DIMENSION_VALUE })).toEqual(true);
  });

  test("SAVE_SERIES", () => {
    expect(reducer(true, { type: SAVE_SERIES })).toEqual(false);
  });

  test("SAVE_SERIES_REJECTED", () => {
    expect(reducer(false, { type: SAVE_SERIES_REJECTED })).toEqual(true);
  });
});
