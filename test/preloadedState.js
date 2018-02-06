// Preloaded state (before API calls).
export default {
  title: "Number of deaths attributed to chronic respiratory disease",
  code: "SH_DTH_CRESPD",
  disabled: true,
  dirty: false,
  dimensions: {
    selectable: [],
    selected: [
      {
        id: "4",
        name: "Nature",
        disabled: true,
        selectable: [],
        selected: [
          { id: "92", value: "C" },
          { id: "93", value: "CA" },
          { id: "94", value: "E" }
        ]
      },
      {
        id: "5",
        name: "Sex",
        disabled: true,
        selectable: [],
        selected: [{ id: "99", value: "Female" }, { id: "100", value: "Male" }]
      },
      {
        id: "8",
        name: "Units",
        disabled: true,
        selectable: [],
        selected: [{ id: "102", value: "USD" }, { id: "103", value: "LCU" }]
      }
    ]
  }
};
