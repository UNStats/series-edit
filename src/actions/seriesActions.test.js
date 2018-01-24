import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import mockFetch from "fetch-mock";
import { saveSeries } from "./seriesActions";
import state from "../../test/loadedState";
import {
  SAVE_SERIES,
  SAVE_SERIES_FULFILLED,
  SAVE_SERIES_REJECTED
} from "../constants/ActionTypes";

describe("seriesActions", () => {
  describe("saveSeries", () => {
    let mockStore;

    beforeAll(() => {
      mockStore = configureMockStore([thunk]);
    });

    afterEach(() => {
      mockFetch.restore();
    });

    test("successful API call", async () => {
      mockFetch.post("/Series/Edit/1035", { status: 200 });
      const expectedActions = [
        { type: SAVE_SERIES, payload: { seriesId: "1035" } },
        { type: SAVE_SERIES_FULFILLED, payload: { seriesId: "1035" } }
      ];
      const store = mockStore(state);
      await store.dispatch(saveSeries("1035"));
      expect(store.getActions()).toEqual(expectedActions);
    });

    test("unsuccessful API call", async () => {
      mockFetch.post("/Series/Edit/1035", { status: 500 });
      const expectedActions = [
        { type: SAVE_SERIES, payload: { seriesId: "1035" } },
        {
          type: SAVE_SERIES_REJECTED,
          payload: {
            seriesId: "1035",
            error: {
              name: "Error",
              message:
                "Request failed with status code 500 (Internal Server Error)"
            }
          }
        }
      ];
      const store = mockStore(state);
      await store.dispatch(saveSeries("1035"));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
