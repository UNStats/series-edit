import reducer from "./titleReducer";

describe("titleReducer", () => {
  test("initial state", () => {
    expect(reducer(undefined, {})).toEqual("");
  });
});
