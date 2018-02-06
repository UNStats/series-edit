// Loaded state (after API calls).
export default {
  title: "Number of deaths attributed to chronic respiratory disease",
  code: "SH_DTH_CRESPD",
  disabled: false,
  dirty: false,
  dimensions: {
    selectable: [
      {
        id: "7",
        name: "UnitMultiplier",
        disabled: true,
        selected: [],
        selectable: []
      },
      {
        id: "11",
        name: "Scenario",
        disabled: true,
        selected: [],
        selectable: []
      }
    ],
    selected: [
      {
        id: "4",
        name: "Nature",
        disabled: false,
        selectable: [
          { id: "95", value: "G" },
          { id: "96", value: "M" },
          { id: "97", value: "N" },
          { id: "98", value: "NA" }
        ],
        selected: [
          { id: "92", value: "C" },
          { id: "93", value: "CA" },
          { id: "94", value: "E" }
        ]
      },
      {
        id: "5",
        name: "Sex",
        disabled: false,
        selectable: [{ id: "101", value: "Both" }],
        selected: [{ id: "99", value: "Female" }, { id: "100", value: "Male" }]
      },
      {
        id: "8",
        name: "Units",
        disabled: false,
        selectable: [
          { id: "104", value: "mgr/m^3" },
          { id: "105", value: "h" },
          { id: "106", value: "index" },
          { id: "107", value: "Kg" }
        ],
        selected: [{ id: "102", value: "USD" }, { id: "103", value: "LCU" }]
      }
    ]
  }
};
