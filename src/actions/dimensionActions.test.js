import configureMockStore from "redux-mock-store"
import thunk from "redux-thunk"
import axios from "axios"
import MockAdapter from "axios-mock-adapter"
import {
  addDimension,
  fetchDimensions,
  removeDimension
} from "./dimensionActions"
import {
  ADD_DIMENSION,
  FETCH_DIMENSIONS,
  FETCH_DIMENSIONS_FULFILLED,
  FETCH_DIMENSIONS_REJECTED,
  FETCH_DIMENSION_VALUES,
  FETCH_DIMENSION_VALUES_FULFILLED,
  FETCH_DIMENSION_VALUES_REJECTED,
  REMOVE_DIMENSION
} from "../constants/ActionTypes"

describe("dimensionActions", () => {
  test("removeDimension", () => {
    expect(removeDimension("999", "99")).toEqual({
      type: REMOVE_DIMENSION,
      payload: {seriesId: "999", dimensionId: "99"}
    })
  })

  describe("addDimension", () => {
    let mockAxios
    let mockStore

    beforeAll(() => {
      mockAxios = new MockAdapter(axios)
      mockStore = configureMockStore([thunk])
    })

    afterAll(() => {
      mockAxios.restore()
    })

    afterEach(() => {
      mockAxios.reset()
    })

    test("successful fetchDimensionValues API call", () => {
      mockAxios
        .onPost("/DimensionValues/getAddValuesBySerie", {
          serieID: 999,
          dimensionID: 99
        })
        .reply(200, [
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
        ])

      const expectedActions = [
        {
          type: ADD_DIMENSION,
          payload: {
            seriesId: "999",
            dimensionId: "99"
          }
        },
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
      ]

      // Content of store does not matter for this test.
      const store = mockStore({})
      return store.dispatch(addDimension("999", "99")).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    })

    test("unsuccessful fetchDimensionValues API call", () => {
      mockAxios
        .onPost("/DimensionValues/getAddValuesBySerie", {
          serieID: 999,
          dimensionID: 99
        })
        .reply(500, "internal server error")

      const expectedActions = [
        {
          type: ADD_DIMENSION,
          payload: {
            seriesId: "999",
            dimensionId: "99"
          }
        },
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
              message: "Request failed with status code 500"
            }
          }
        }
      ]

      // Content of store does not matter for this test.
      const store = mockStore({})
      return store.dispatch(addDimension("999", "99")).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })

  describe("fetchDimensions", () => {
    let mockAxios
    let mockStore

    beforeAll(() => {
      mockAxios = new MockAdapter(axios)
      mockStore = configureMockStore([thunk])
    })

    afterAll(() => {
      mockAxios.restore()
    })

    afterEach(() => {
      mockAxios.reset()
    })

    test("successful API call", () => {
      mockAxios
        .onPost("/Dimensions/getAddDimensionBySerie", {
          serieID: 999
        })
        .reply(200, [
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
        ])

      const expectedActions = [
        {type: FETCH_DIMENSIONS, payload: {seriesId: "999"}},
        {
          type: FETCH_DIMENSIONS_FULFILLED,
          payload: {
            seriesId: "999",
            values: [
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
      ]

      // Content of store does not matter for this test.
      const store = mockStore({})
      return store.dispatch(fetchDimensions("999")).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    })

    test("unsuccessful API call", () => {
      mockAxios
        .onPost("/Dimensions/getAddDimensionBySerie", {
          serieID: 999
        })
        .reply(500, "internal server error")

      const expectedActions = [
        {type: FETCH_DIMENSIONS, payload: {seriesId: "999"}},
        {
          type: FETCH_DIMENSIONS_REJECTED,
          payload: {
            seriesId: "999",
            error: {
              name: "Error",
              message: "Request failed with status code 500"
            }
          }
        }
      ]

      // Content of store does not matter for this test.
      const store = mockStore({})
      return store.dispatch(fetchDimensions("999")).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })
})
