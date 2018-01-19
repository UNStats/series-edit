import selector from "./selectedDimensionValuesSelector";
import loadedState from "../../test/loadedState";
import preloadedState from "../../test/preloadedState";

describe("selectedDimensionValuesSelector", () => {
  test("non-empty selected values", () => {
    expect(selector("4")(loadedState)).toEqual([
      { key: "92", value: "C" },
      { key: "93", value: "CA" },
      { key: "94", value: "E" }
    ]);
  });

  test("empty selected values", () => {
    preloadedState.dimensions.selected[0].selected = [];
    expect(selector("4")(preloadedState)).toEqual([]);
  });
});
