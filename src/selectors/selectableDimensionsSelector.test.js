import selector from "./selectableDimensionsSelector";
import loadedState from "../../test/loadedState";
import preloadedState from "../../test/preloadedState";

describe("selectableDimensionsSelector", () => {
  test("loaded state", () => {
    expect(selector(loadedState)).toEqual([
      { key: "7", value: "UnitMultiplier" },
      { key: "11", value: "Scenario" }
    ]);
  });

  test("preloaded state", () => {
    expect(selector(preloadedState)).toEqual([]);
  });
});
