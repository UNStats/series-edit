import React from "react";
import { mount } from "enzyme";
import SelectableDimensionsFactory from "./SelectableDimensionsFactory";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import loadedState from "../../test/loadedState";
import preloadedState from "../../test/preloadedState";
import { ADD_DIMENSION, FETCH_DIMENSIONS } from "../constants/ActionTypes";

describe("SelectableDimensions", () => {
  let SelectableDimensions;

  beforeAll(() => {
    SelectableDimensions = SelectableDimensionsFactory("1035");
  });

  test("renders Dropdown with non-empty selectable dimensions", () => {
    const store = configureMockStore([thunk])(loadedState);
    const dropdown = mount(
      <Provider store={store}>
        <SelectableDimensions />
      </Provider>
    ).find("Dropdown");
    // No need to test actual rendering of Dropdown. This is done in
    // @unstats/components. Here we test that correct properties are passed in.
    const props = dropdown.props();
    expect(Object.keys(props).length).toEqual(5);
    const { value, disabled, options, placeholder, onChange } = props;
    expect(value).toEqual("");
    expect(disabled).toEqual(false);
    expect(placeholder).toEqual("Add dimension...");
    expect(options).toEqual([
      { key: "7", value: "UnitMultiplier" },
      { key: "11", value: "Scenario" }
    ]);
    expect(onChange).toBeDefined();
    // Because selectable dimensions is not empty, componentDidMount() should
    // not trigger FETCH_DIMENSIONS.
    expect(store.getActions()).toEqual([]);
  });

  test("renders Dropdown with empty selectable dimensions", () => {
    const store = configureMockStore([thunk])(preloadedState);
    const dropdown = mount(
      <Provider store={store}>
        <SelectableDimensions />
      </Provider>
    ).find("Dropdown");
    const {
      value,
      disabled,
      options,
      placeholder,
      onChange
    } = dropdown.props();
    expect(value).toEqual("");
    expect(disabled).toEqual(true);
    expect(placeholder).toEqual("Add dimension...");
    expect(options).toEqual([]);
    expect(onChange).toBeDefined();
    // Because selectable dimensions is empty, FETCH_DIMENSIONS should be
    // triggered in componentDidMount(). Since jsdom does not implement fetch,
    // there is no FETCH_DIMENSIONS_FULFILLED or FETCH_DIMENSIONS_REJECTED.
    expect(store.getActions()).toEqual([{ type: FETCH_DIMENSIONS }]);
  });

  test("disable", () => {
    const store = configureMockStore([thunk])(loadedState);
    const dropdown = mount(
      <Provider store={store}>
        <SelectableDimensions disabled={true} />
      </Provider>
    ).find("Dropdown");
    expect(dropdown.props().disabled).toEqual(true);
  });

  test("onChange handler", () => {
    const store = configureMockStore([thunk])(loadedState);
    const select = mount(
      <Provider store={store}>
        <SelectableDimensions />
      </Provider>
    ).find("select");
    select.simulate("change", { target: { value: "11" } });
    expect(store.getActions()).toEqual([
      { type: ADD_DIMENSION, payload: { dimensionId: "11" } }
    ]);
  });
});
