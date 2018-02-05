import selector from "./isSelectedDimensionDisabledSelector";
import loadedState from "../../test/loadedState";

describe("isSelectedDimensionDisabledSelector", () => {
  test("dimension exists", () => {
    expect(selector("4")(loadedState)).toEqual(false);
  });

  test("dimension does not exist", () => {
    expect(selector("7")(loadedState)).toBeUndefined();
  });
});
