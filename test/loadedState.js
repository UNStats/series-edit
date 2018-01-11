// Loaded state (after API calls).
export default {
  series: {
    id: "1035",
    title: "Number of deaths attributed to chronic respiratory disease",
    code: "SH_DTH_CRESPD"
  },
  dimensions: {
    selected: [
      {
        id: "4",
        name: "Nature",
        selected: [
          { id: "92", value: "C" },
          { id: "93", value: "CA" },
          { id: "94", value: "E" }
        ],
        selectable: [
          { id: "95", value: "G" },
          { id: "96", value: "M" },
          { id: "97", value: "N" },
          { id: "98", value: "NA" }
        ]
      },
      {
        id: "5",
        name: "Sex",
        selected: [{ id: "99", value: "Female" }, { id: "100", value: "Male" }],
        selectable: [{ id: "101", value: "Both" }]
      },
      {
        id: "8",
        name: "Units",
        selected: [{ id: "102", value: "USD" }, { id: "103", value: "LCU" }],
        selectable: [
          { id: "104", value: "mgr/m^3" },
          { id: "105", value: "h" },
          { id: "106", value: "index" },
          { id: "107", value: "Kg" }
        ]
      }
    ],
    selectable: [
      {
        id: "7",
        name: "UnitMultiplier",
        selected: [],
        selectable: []
      },
      {
        id: "11",
        name: "Scenario",
        selected: [],
        selectable: []
      }
    ]
  }
};
