// Mock fetch calls to API.
window.fetchMock.get(
  "/Dimensions/getAddDimensionBySerie",
  {
    status: 200,
    body: [
      { id: 4, value: "Nature" },
      { id: 5, value: "Sex" },
      { id: 7, value: "UnitMultiplier" },
      { id: 8, value: "Units" },
      { id: 11, value: "Scenario" }
    ]
  },
  {
    query: { serieID: "1035" }
  }
);

window.fetchMock.get(
  "/DimensionValues/getAddValuesBySerie?serieID=1035&dimensionID=4",
  {
    status: 200,
    body: [
      { id: 92, value: "C" },
      { id: 93, value: "CA" },
      { id: 94, value: "E" },
      { id: 95, value: "G" },
      { id: 96, value: "M" },
      { id: 97, value: "N" },
      { id: 98, value: "NA" }
    ]
  }
);

window.fetchMock.get(
  "/DimensionValues/getAddValuesBySerie?serieID=1035&dimensionID=5",
  {
    status: 200,
    body: [
      { id: 99, value: "Female" },
      { id: 100, value: "Male" },
      { id: 101, value: "Both" }
    ]
  }
);

window.fetchMock.get(
  "/DimensionValues/getAddValuesBySerie?serieID=1035&dimensionID=7",
  {
    status: 200,
    body: [
      { id: 142, value: "U" },
      { id: 143, value: "tr" },
      { id: 144, value: "Tr" },
      { id: 145, value: "Q" },
      { id: 146, value: "H" },
      { id: 147, value: "TH" },
      { id: 148, value: "TTH" },
      { id: 149, value: "M" },
      { id: 150, value: "B" }
    ]
  }
);

window.fetchMock.get(
  "/DimensionValues/getAddValuesBySerie?serieID=1035&dimensionID=8",
  {
    status: 200,
    body: [
      { id: 102, value: "USD" },
      { id: 103, value: "LCU" },
      { id: 104, value: "mgr/m^3" },
      { id: 105, value: "h" },
      { id: 106, value: "index" },
      { id: 107, value: "Kg" }
    ]
  }
);

window.fetchMock.get(
  "/DimensionValues/getAddValuesBySerie?serieID=1035&dimensionID=11",
  {
    status: 200,
    body: [
      { id: 157, value: "P" },
      { id: 158, value: "LB" },
      { id: 159, value: "UB" }
    ]
  }
);

window.fetchMock.post("/Series/Edit/1035", {
  status: 200
});
