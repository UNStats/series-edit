import reducer from "./codeReducer";

describe("codeReducer", () => {
  test("initial state", () => {
    expect(reducer(undefined, {})).toEqual("");
  });
});
