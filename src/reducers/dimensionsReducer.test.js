import deepFreeze from "deep-freeze";
import reducer from "./dimensionsReducer";
import {
  ADD_DIMENSION_VALUE,
  REMOVE_DIMENSION_VALUE,
  ADD_DIMENSION,
  REMOVE_DIMENSION,
  FETCH_DIMENSION_VALUES_FULFILLED,
  FETCH_DIMENSIONS_FULFILLED
} from "../constants/ActionTypes";
import loadedState from "../../test/loadedState";
import preloadedState from "../../test/preloadedState";

deepFreeze(loadedState);
deepFreeze(preloadedState);

describe("dimensionsReducer", () => {
  test("initial state", () => {
    expect(reducer(undefined, {})).toEqual({
      selected: [],
      selectable: []
    });
  });

  test("invalid action", () => {
    const state = {};
    deepFreeze(state);
    // Compare reference, not object!
    expect(reducer(state, { type: "INVALID_ACTION" })).toBe(state);
  });

  describe("ADD_DIMENSION_VALUE", () => {
    describe("payload dimension is in selected dimensions", () => {
      test("payload value is in selectable values", () => {
        const stateBefore = loadedState.dimensions;
        const stateAfter = reducer(stateBefore, {
          type: ADD_DIMENSION_VALUE,
          payload: {
            dimensionId: "4",
            valueId: "97"
          }
        });
        // Value with id `97` is moved from `selectable` to `selected.`
        expect(stateAfter.selected[0]).toEqual({
          id: "4",
          name: "Nature",
          disabled: false,
          selected: [
            { id: "92", value: "C" },
            { id: "93", value: "CA" },
            { id: "94", value: "E" },
            { id: "97", value: "N" }
          ],
          selectable: [
            { id: "95", value: "G" },
            { id: "96", value: "M" },
            { id: "98", value: "NA" }
          ]
        });
      });

      test("payload value is not in selectable values", () => {
        const stateBefore = loadedState.dimensions;
        const stateAfter = reducer(stateBefore, {
          type: ADD_DIMENSION_VALUE,
          payload: {
            dimensionId: "4",
            valueId: "999"
          }
        });
        expect(stateAfter).toBe(stateBefore);
      });
    });

    test("payload dimension is not in selected dimensions", () => {
      const stateBefore = loadedState.dimensions;
      const stateAfter = reducer(stateBefore, {
        type: ADD_DIMENSION_VALUE,
        payload: {
          dimensionId: "7"
        }
      });
      expect(stateAfter).toBe(stateBefore);
    });
  });

  describe("REMOVE_DIMENSION_VALUE", () => {
    describe("payload dimension is in selected dimensions", () => {
      test("payload value is in selected values", () => {
        const stateBefore = loadedState.dimensions;
        const stateAfter = reducer(stateBefore, {
          type: REMOVE_DIMENSION_VALUE,
          payload: {
            dimensionId: "4",
            valueId: "93"
          }
        });
        // Value `93` is moved from `selected` to `selectable`.
        expect(stateAfter.selected[0]).toEqual({
          id: "4",
          name: "Nature",
          disabled: false,
          selected: [{ id: "92", value: "C" }, { id: "94", value: "E" }],
          selectable: [
            { id: "95", value: "G" },
            { id: "96", value: "M" },
            { id: "97", value: "N" },
            { id: "98", value: "NA" },
            { id: "93", value: "CA" }
          ]
        });
      });

      test("payload value is not in selected values", () => {
        const stateBefore = loadedState.dimensions;
        const stateAfter = reducer(stateBefore, {
          type: REMOVE_DIMENSION_VALUE,
          payload: {
            dimensionId: "4",
            valueId: "97"
          }
        });
        expect(stateAfter).toBe(stateBefore);
      });
    });

    test("payload dimension is not in selected dimensions", () => {
      const stateBefore = loadedState.dimensions;
      const stateAfter = reducer(stateBefore, {
        type: REMOVE_DIMENSION_VALUE,
        payload: {
          dimensionId: "99"
        }
      });
      expect(stateAfter).toBe(stateBefore);
    });
  });

  describe("ADD_DIMENSION", () => {
    test("payload dimension is in selectable dimensions", () => {
      const stateBefore = loadedState.dimensions;
      const stateAfter = reducer(stateBefore, {
        type: ADD_DIMENSION,
        payload: { dimensionId: "11" }
      });
      // Dimension with id 11 is removed from selectable dimensions.
      expect(stateAfter.selectable.map(dimension => dimension.id)).toEqual([
        "7"
      ]);
      // Dimension with id 11 is added to selected dimensions.
      expect(stateAfter.selected.map(dimension => dimension.id)).toEqual([
        "11",
        "4",
        "5",
        "8"
      ]);
    });

    test("payload dimension is not in selectable dimensions", () => {
      const stateBefore = loadedState.dimensions;
      const stateAfter = reducer(stateBefore, {
        type: ADD_DIMENSION,
        payload: { dimensionId: "4" }
      });
      expect(stateAfter).toBe(stateBefore);
    });
  });

  describe("REMOVE_DIMENSION", () => {
    test("payload dimension is in selected dimensions", () => {
      const stateBefore = loadedState.dimensions;
      const stateAfter = reducer(stateBefore, {
        type: REMOVE_DIMENSION,
        payload: { dimensionId: "4" }
      });
      // Dimension with id 4 is removed from selected dimensions.
      expect(stateAfter.selected.map(dimension => dimension.id)).toEqual([
        "5",
        "8"
      ]);
      // Dimension with id 4 is added to selectable dimensions.
      expect(stateAfter.selectable.map(dimension => dimension.id)).toEqual([
        "7",
        "11",
        "4"
      ]);
      // Removed dimension's selected and selectable dimensions values reset.
      expect(stateAfter.selectable[2]).toEqual({
        id: "4",
        name: "Nature",
        disabled: false,
        selected: [],
        selectable: []
      });
    });

    test("payload dimension is not in selected dimensions", () => {
      const stateBefore = loadedState.dimensions;
      const stateAfter = reducer(stateBefore, {
        type: REMOVE_DIMENSION,
        payload: { dimensionId: "11" }
      });
      expect(stateAfter).toBe(stateBefore);
    });
  });

  describe("FETCH_DIMENSION_VALUES_FULFILLED", () => {
    describe("payload dimension is in selected dimensions", () => {
      test("payload values contain already selected and selectable values", () => {
        const stateBefore = preloadedState.dimensions;
        const stateAfter = reducer(stateBefore, {
          type: FETCH_DIMENSION_VALUES_FULFILLED,
          payload: {
            dimensionId: "4",
            values: [
              { id: "92", value: "C" },
              { id: "93", value: "CA" },
              { id: "94", value: "E" },
              { id: "95", value: "G" },
              { id: "96", value: "M" },
              { id: "97", value: "N" },
              { id: "98", value: "NA" }
            ]
          }
        });
        expect(stateAfter.selected[0]).toEqual({
          id: "4",
          name: "Nature",
          disabled: false,
          selected: [
            { id: "92", value: "C" },
            { id: "93", value: "CA" },
            { id: "94", value: "E" }
          ],
          selectable: [
            { id: "95", value: "G" },
            { id: "96", value: "M" },
            { id: "97", value: "N" },
            { id: "98", value: "NA" }
          ]
        });
      });

      test("payload values contain already selected values only", () => {
        const stateBefore = preloadedState.dimensions;
        const stateAfter = reducer(stateBefore, {
          type: FETCH_DIMENSION_VALUES_FULFILLED,
          payload: {
            dimensionId: "4",
            values: [
              { id: "92", value: "C" },
              { id: "93", value: "CA" },
              { id: "94", value: "E" }
            ]
          }
        });
        expect(stateAfter.selected[0]).toEqual({
          id: "4",
          name: "Nature",
          disabled: false,
          selected: [
            { id: "92", value: "C" },
            { id: "93", value: "CA" },
            { id: "94", value: "E" }
          ],
          selectable: []
        });
      });
    });

    test("payload dimension is not in selected dimensions", () => {
      const stateBefore = preloadedState.dimensions;
      const stateAfter = reducer(stateBefore, {
        type: FETCH_DIMENSION_VALUES_FULFILLED,
        payload: { dimensionId: "99" }
      });
      expect(stateAfter).toBe(stateBefore);
    });
  });

  describe("FETCH_DIMENSIONS_FULFILLED", () => {
    test("payload values contain already selected and selectable dimensions", () => {
      const stateBefore = preloadedState.dimensions;
      const stateAfter = reducer(stateBefore, {
        type: FETCH_DIMENSIONS_FULFILLED,
        payload: {
          dimensions: [
            { id: "4", value: "Nature" },
            { id: "5", value: "Sex" },
            { id: "7", value: "UnitMultiplier" },
            { id: "8", value: "Units" },
            { id: "11", value: "Scenario" }
          ]
        }
      });
      expect(stateAfter.selectable).toEqual([
        {
          id: "7",
          name: "UnitMultiplier",
          disabled: true,
          selected: [],
          selectable: []
        },
        {
          id: "11",
          name: "Scenario",
          disabled: true,
          selected: [],
          selectable: []
        }
      ]);
    });

    test("payload values contain already selected dimensions only", () => {
      const stateBefore = preloadedState.dimensions;
      const stateAfter = reducer(stateBefore, {
        type: FETCH_DIMENSIONS_FULFILLED,
        payload: {
          dimensions: [
            { id: "4", value: "Nature" },
            { id: "5", value: "Sex" },
            { id: "8", value: "Units" }
          ]
        }
      });
      expect(stateAfter.selectable).toEqual([]);
    });
  });
});
