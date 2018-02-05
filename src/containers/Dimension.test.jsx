import React from "react";
import { mount } from "enzyme";
import Dimension from "./Dimension";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import loadedState from "../../test/loadedState";
import preloadedState from "../../test/preloadedState";
import {
  ADD_DIMENSION_VALUE,
  REMOVE_DIMENSION_VALUE,
  FETCH_DIMENSION_VALUES
} from "../constants/ActionTypes";

describe("Dimension", () => {
  test("renders ValuePicker with non-empty selectable values", () => {
    const store = configureMockStore([thunk])(loadedState);
    const valuePicker = mount(
      <Provider store={store}>
        <Dimension name="Nature" seriesId="1035" dimensionId="4" />
      </Provider>
    ).find("ValuePicker");
    // No need to test actual rendering of ValuePicker. This is done in
    // @unstats/components. Here we test that correct properties are passed in.
    const props = valuePicker.props();
    expect(Object.keys(props).length).toEqual(6);
    const {
      title,
      disabled,
      selectable,
      selected,
      onAddValue,
      onRemoveValue
    } = props;
    expect(title).toEqual("Nature");
    expect(disabled).toEqual(false);
    expect(selectable).toEqual([
      { key: "95", value: "G" },
      { key: "96", value: "M" },
      { key: "97", value: "N" },
      { key: "98", value: "NA" }
    ]);
    expect(selected).toEqual([
      { key: "92", value: "C" },
      { key: "93", value: "CA" },
      { key: "94", value: "E" }
    ]);
    expect(onAddValue).toBeDefined();
    expect(onRemoveValue).toBeDefined();
    // Because selectable values is not empty, componentDidMount() should not
    // trigger FETCH_DIMENSION_VALUES.
    expect(store.getActions()).toEqual([]);
  });

  test("renders ValuePicker with empty selectable values", () => {
    const store = configureMockStore([thunk])(preloadedState);
    const valuePicker = mount(
      <Provider store={store}>
        <Dimension name="Nature" seriesId="1035" dimensionId="4" />
      </Provider>
    ).find("ValuePicker");
    // No need to test actual rendering of ValuePicker. This is done in
    // @unstats/components. Here we test that correct properties are passed in.
    const props = valuePicker.props();
    expect(Object.keys(props).length).toEqual(6);
    const {
      title,
      disabled,
      selectable,
      selected,
      onAddValue,
      onRemoveValue
    } = props;
    expect(title).toEqual("Nature");
    expect(disabled).toEqual(true);
    expect(selectable).toEqual([]);
    expect(selected).toEqual([
      { key: "92", value: "C" },
      { key: "93", value: "CA" },
      { key: "94", value: "E" }
    ]);
    expect(onAddValue).toBeDefined();
    expect(onRemoveValue).toBeDefined();
    expect(store.getActions()).toEqual([
      { type: FETCH_DIMENSION_VALUES, payload: { dimensionId: "4" } }
    ]);
  });

  test("onAddValue handler", () => {
    const store = configureMockStore([thunk])(loadedState);
    const select = mount(
      <Provider store={store}>
        <Dimension name="Nature" seriesId="1035" dimensionId="4" />
      </Provider>
    ).find("select");
    select.simulate("change", {
      target: { value: "95" }
    });
    expect(store.getActions()).toEqual([
      {
        type: ADD_DIMENSION_VALUE,
        payload: { dimensionId: "4", valueId: "95" }
      }
    ]);
  });

  test("onRemoveValue handler", () => {
    const store = configureMockStore([thunk])(loadedState);
    mount(
      <Provider store={store}>
        <Dimension name="Nature" seriesId="1035" dimensionId="4" />
      </Provider>
    )
      .find('button[value="93"]')
      .simulate("click");
    expect(store.getActions()).toEqual([
      {
        type: REMOVE_DIMENSION_VALUE,
        payload: { dimensionId: "4", valueId: "93" }
      }
    ]);
  });
});
