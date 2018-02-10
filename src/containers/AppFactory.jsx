import React, { Component } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { Provider as RebassProvider } from "rebass";
import PropTypes from "prop-types";
import SelectableDimensionsFactory from "./SelectableDimensionsFactory";
import SelectedDimensionsFactory from "./SelectedDimensionsFactory";
import SaveButtonFactory from "./SaveButtonFactory";

const AppFactory = (seriesId, token) => {
  const SelectableDimensions = SelectableDimensionsFactory(seriesId);
  const SelectedDimensions = SelectedDimensionsFactory(seriesId);
  const SaveButton = SaveButtonFactory(seriesId, token);
  return class App extends Component {
    static propTypes = {
      store: PropTypes.object
    };

    render() {
      return (
        <ReduxProvider store={this.props.store}>
          <RebassProvider>
            <div>
              <SelectableDimensions />
              <SelectedDimensions />
              <SaveButton />
            </div>
          </RebassProvider>
        </ReduxProvider>
      );
    }
  };
};

export default AppFactory;
