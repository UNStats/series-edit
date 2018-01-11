import seriesReducer from "./seriesReducer"

describe("seriesReducer", () => {
  test("initial state", () => {
    expect(seriesReducer(undefined, {})).toEqual({})
  })
})
