import selector from "./selectedDimensionsSelector"
import loadedState from "../test/loadedState"
import preloadedState from "../test/preloadedState"

describe("selectedDimensionsSelector", () => {
  test("loaded state", () => {
    expect(selector(loadedState)).toEqual([
      {
        key: "4",
        title: "Nature",
        selected: [
          {key: "92", value: "C"},
          {key: "93", value: "CA"},
          {key: "94", value: "E"}
        ],
        selectable: [
          {key: "95", value: "G"},
          {key: "96", value: "M"},
          {key: "97", value: "N"},
          {key: "98", value: "NA"}
        ]
      },
      {
        key: "5",
        title: "Sex",
        selected: [{key: "99", value: "Female"}, {key: "100", value: "Male"}],
        selectable: [{key: "101", value: "Both"}]
      },
      {
        key: "8",
        title: "Units",
        selected: [{key: "102", value: "USD"}, {key: "103", value: "LCU"}],
        selectable: [
          {key: "104", value: "mgr/m^3"},
          {key: "105", value: "h"},
          {key: "106", value: "index"},
          {key: "107", value: "Kg"}
        ]
      }
    ])
  })

  test("preloaded state", () => {
    expect(selector(preloadedState)).toEqual([
      {
        key: "4",
        title: "Nature",
        selected: [
          {key: "92", value: "C"},
          {key: "93", value: "CA"},
          {key: "94", value: "E"}
        ],
        selectable: []
      },
      {
        key: "5",
        title: "Sex",
        selected: [{key: "99", value: "Female"}, {key: "100", value: "Male"}],
        selectable: []
      },
      {
        key: "8",
        title: "Units",
        selected: [{key: "102", value: "USD"}, {key: "103", value: "LCU"}],
        selectable: []
      }
    ])
  })
})
