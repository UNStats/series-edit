import React from "react";
import { mount } from "enzyme";
import SelectedDimensionsFactory from "./SelectedDimensionsFactory";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import loadedState from "../../test/loadedState";
import preloadedState from "../../test/preloadedState";
import {
  REMOVE_DIMENSION,
  FETCH_DIMENSION_VALUES
} from "../constants/ActionTypes";

describe("SelectedDimensions", () => {
  let SelectedDimensions;

  beforeAll(() => {
    SelectedDimensions = SelectedDimensionsFactory("1035");
  });

  test("renders selected dimensions correctly", () => {
    const store = configureMockStore([thunk])(loadedState);
    const dimensions = mount(
      <Provider store={store}>
        <SelectedDimensions />
      </Provider>
    ).find("Dimension");
    expect(dimensions.length).toEqual(3);

    // Check "Nature" dimension.
    let dimension = dimensions.at(0);
    let props = dimension.props();
    expect(Object.keys(props).length).toEqual(7);
    let { name, disabled, selectable, selected } = props;
    expect(name).toEqual("Nature");
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

    // Check "Sex" dimension.
    dimension = dimensions.at(1);
    props = dimension.props();
    expect(Object.keys(props).length).toEqual(7);
    ({ name, disabled, selectable, selected } = props);
    expect(name).toEqual("Sex");
    expect(disabled).toEqual(false);
    expect(selectable).toEqual([{ key: "101", value: "Both" }]);
    expect(selected).toEqual([
      { key: "99", value: "Female" },
      { key: "100", value: "Male" }
    ]);

    // Check "Units" dimension.
    dimension = dimensions.at(2);
    props = dimension.props();
    expect(Object.keys(props).length).toEqual(7);
    ({ name, disabled, selectable, selected } = props);
    expect(name).toEqual("Units");
    expect(disabled).toEqual(false);
    expect(selectable).toEqual([
      { key: "104", value: "mgr/m^3" },
      { key: "105", value: "h" },
      { key: "106", value: "index" },
      { key: "107", value: "Kg" }
    ]);
    expect(selected).toEqual([
      { key: "102", value: "USD" },
      { key: "103", value: "LCU" }
    ]);
  });

  test("runs no initialization actions when rendered with loadedState", () => {
    const store = configureMockStore([thunk])(loadedState);
    mount(
      <Provider store={store}>
        <SelectedDimensions />
      </Provider>
    );
    expect(store.getActions()).toEqual([]);
  });

  test("runs no initialization actions when rendered with preloadedState", () => {
    const store = configureMockStore([thunk])(preloadedState);
    mount(
      <Provider store={store}>
        <SelectedDimensions />
      </Provider>
    );
    expect(store.getActions()).toEqual([
      {
        type: FETCH_DIMENSION_VALUES,
        payload: {
          dimensionId: "4"
        }
      },
      {
        type: FETCH_DIMENSION_VALUES,
        payload: {
          dimensionId: "5"
        }
      },
      {
        type: FETCH_DIMENSION_VALUES,
        payload: {
          dimensionId: "8"
        }
      }
    ]);
  });

  test("disable", () => {
    const store = configureMockStore([thunk])(loadedState);
    const wrapper = mount(
      <Provider store={store}>
        <SelectedDimensions disabled={true} />
      </Provider>
    );

    // Verify that Dimension components are disabled.
    const dimensions = wrapper.find("Dimension");
    expect(dimensions.length).toEqual(3);
    dimensions.forEach(dimension => {
      expect(dimension.props().disabled).toEqual(true);
    });

    // Verify that remove buttons are disabled.
    const removeButtons = wrapper.find('button[children="Remove"]');
    removeButtons.forEach(button => {
      expect(button.props().disabled).toEqual(true);
    });
  });

  test("onRemoveDimension handler", () => {
    const store = configureMockStore([thunk])(loadedState);
    const removeButtons = mount(
      <Provider store={store}>
        <SelectedDimensions />
      </Provider>
    ).find('button[children="Remove"]');
    expect(removeButtons.length).toEqual(3);
    removeButtons.at(1).simulate("click");
    expect(store.getActions()).toEqual([
      { type: REMOVE_DIMENSION, payload: { dimensionId: "5" } }
    ]);
  });
});
