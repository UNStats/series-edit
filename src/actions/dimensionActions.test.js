import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import mockFetch from "fetch-mock";
import {
  addDimension,
  fetchDimensions,
  removeDimension
} from "./dimensionActions";
import {
  ADD_DIMENSION,
  FETCH_DIMENSIONS,
  FETCH_DIMENSIONS_FULFILLED,
  FETCH_DIMENSIONS_REJECTED,
  REMOVE_DIMENSION
} from "../constants/ActionTypes";

describe("dimensionActions", () => {
  test("addDimension", () => {
    expect(addDimension("99")).toEqual({
      type: ADD_DIMENSION,
      payload: { dimensionId: "99" }
    });
  });

  test("removeDimension", () => {
    expect(removeDimension("99")).toEqual({
      type: REMOVE_DIMENSION,
      payload: { dimensionId: "99" }
    });
  });

  describe("fetchDimensions", () => {
    let mockStore;

    beforeAll(() => {
      mockStore = configureMockStore([thunk]);
    });

    afterEach(() => {
      mockFetch.restore();
    });

    test("successful API call", async () => {
      mockFetch.get(
        "/Dimensions/getAddDimensionBySerie",
        {
          status: 200,
          body: [
            {
              id: 1,
              value: "dimension-1"
            },
            {
              id: 2,
              value: "dimension-2"
            },
            {
              id: 3,
              value: "dimension-3"
            }
          ]
        },
        {
          query: { serieID: "999" }
        }
      );

      const expectedActions = [
        { type: FETCH_DIMENSIONS },
        {
          type: FETCH_DIMENSIONS_FULFILLED,
          payload: {
            dimensions: [
              {
                id: "1",
                value: "dimension-1"
              },
              {
                id: "2",
                value: "dimension-2"
              },
              {
                id: "3",
                value: "dimension-3"
              }
            ]
          }
        }
      ];

      // Content of store does not matter for this test.
      const store = mockStore({});
      await store.dispatch(fetchDimensions("999"));
      expect(store.getActions()).toEqual(expectedActions);
    });

    test("unsuccessful API call", async () => {
      mockFetch.get(
        "/Dimensions/getAddDimensionBySerie",
        {
          status: 500
        },
        {
          query: {
            serieID: "999"
          }
        }
      );

      const expectedActions = [
        { type: FETCH_DIMENSIONS },
        {
          type: FETCH_DIMENSIONS_REJECTED,
          payload: {
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
      await store.dispatch(fetchDimensions("999"));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
