import React from "react";
import { mount } from "enzyme";
import SaveButtonFactory from "./SaveButtonFactory";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { SAVE_SERIES } from "../constants/ActionTypes";

describe("SaveButtonFactory", () => {
  let SaveButton;
  let loadedState;

  beforeAll(() => {
    SaveButton = SaveButtonFactory("1035");
  });

  beforeEach(() => {
    // Reset loadedState for each test.
    loadedState = require("../../test/loadedState").default;
  });

  test("renders button", () => {
    const store = configureMockStore([thunk])(loadedState);
    const button = mount(
      <Provider store={store}>
        <SaveButton />
      </Provider>
    ).find("button");
    const { disabled, onClick } = button.props();
    // Button is initially disabled.
    expect(disabled).toEqual(true);
    expect(onClick).toBeDefined();
  });

  test("disabled button cannot be enabled with disabled prop", () => {
    const store = configureMockStore([thunk])(loadedState);
    const button = mount(
      <Provider store={store}>
        <SaveButton disabled={false} />
      </Provider>
    ).find("button");
    expect(button.props().disabled).toEqual(true);
  });

  test("onClick", () => {
    loadedState.dirty = true;
    const store = configureMockStore([thunk])(loadedState);
    mount(
      <Provider store={store}>
        <SaveButton />
      </Provider>
    )
      .find("button")
      .simulate("click");
    expect(store.getActions()).toEqual([{ type: SAVE_SERIES }]);
  });
});
