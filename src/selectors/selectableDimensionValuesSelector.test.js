import selector from "./selectableDimensionValuesSelector";
import loadedState from "../../test/loadedState";
import preloadedState from "../../test/preloadedState";

describe("selectableDimensionValuesSelector", () => {
  test("non-empty selectable values", () => {
    expect(selector("4")(loadedState)).toEqual([
      { key: "95", value: "G" },
      { key: "96", value: "M" },
      { key: "97", value: "N" },
      { key: "98", value: "NA" }
    ]);
  });

  test("empty selectable values", () => {
    expect(selector("4")(preloadedState)).toEqual([]);
  });
});
