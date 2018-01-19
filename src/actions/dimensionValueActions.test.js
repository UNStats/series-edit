import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import mockFetch from "fetch-mock";
import {
  addDimensionValue,
  fetchDimensionValues,
  removeDimensionValue
} from "./dimensionValueActions";
import {
  ADD_DIMENSION_VALUE,
  FETCH_DIMENSION_VALUES,
  FETCH_DIMENSION_VALUES_FULFILLED,
  FETCH_DIMENSION_VALUES_REJECTED,
  REMOVE_DIMENSION_VALUE
} from "../constants/ActionTypes";

describe("dimensionValueActions", () => {
  test("addDimensionValue", () => {
    expect(addDimensionValue("999", "99", "9")).toEqual({
      type: ADD_DIMENSION_VALUE,
      payload: { seriesId: "999", dimensionId: "99", valueId: "9" }
    });
  });

  test("removeDimensionValue", () => {
    expect(removeDimensionValue("999", "99", "9")).toEqual({
      type: REMOVE_DIMENSION_VALUE,
      payload: { seriesId: "999", dimensionId: "99", valueId: "9" }
    });
  });

  describe("fetchDimensionValues", () => {
    let mockStore;

    beforeAll(() => {
      mockStore = configureMockStore([thunk]);
    });

    afterEach(() => {
      mockFetch.restore();
    });

    test("successful API call", async () => {
      mockFetch.get(
        "/DimensionValues/getAddValuesBySerie",
        {
          status: 200,
          body: [
            {
              id: 1,
              value: "value-1"
            },
            {
              id: 2,
              value: "value-2"
            },
            {
              id: 3,
              value: "value-3"
            }
          ]
        },
        {
          query: { serieID: "999", dimensionID: "99" }
        }
      );

      const expectedActions = [
        {
          type: FETCH_DIMENSION_VALUES,
          payload: {
            seriesId: "999",
            dimensionId: "99"
          }
        },
        {
          type: FETCH_DIMENSION_VALUES_FULFILLED,
          payload: {
            seriesId: "999",
            dimensionId: "99",
            values: [
              {
                id: "1",
                value: "value-1"
              },
              {
                id: "2",
                value: "value-2"
              },
              {
                id: "3",
                value: "value-3"
              }
            ]
          }
        }
      ];

      // Content of store does not matter for this test.
      const store = mockStore({});
      await store.dispatch(fetchDimensionValues("999", "99"));
      expect(store.getActions()).toEqual(expectedActions);
    });

    test("unsuccessful API call", async () => {
      mockFetch.get(
        "/DimensionValues/getAddValuesBySerie",
        {
          status: 500
        },
        {
          query: {
            serieID: "999",
            dimensionID: "99"
          }
        }
      );

      const expectedActions = [
        {
          type: FETCH_DIMENSION_VALUES,
          payload: {
            seriesId: "999",
            dimensionId: "99"
          }
        },
        {
          type: FETCH_DIMENSION_VALUES_REJECTED,
          payload: {
            seriesId: "999",
            dimensionId: "99",
            error: {
              name: "Error",
              message:
                "Request failed with status code 500 (Internal Server Error)"
            }
          }
        }
      ];

      // Content of store does not matter for this test.
      const store = mockStore({});
      await store.dispatch(fetchDimensionValues("999", "99"));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
