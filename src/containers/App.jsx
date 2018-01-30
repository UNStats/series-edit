import React, { Component } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { Provider as RebassProvider } from "rebass";
import PropTypes from "prop-types";
import SelectableDimensions from "./SelectableDimensions";
import SelectedDimensions from "./SelectedDimensions";

class App extends Component {
  render() {
    const { seriesId, store } = this.props;
    return (
      <ReduxProvider store={store}>
        <RebassProvider>
          <div>
            <SelectableDimensions seriesId={seriesId} />
            <SelectedDimensions seriesId={seriesId} />
          </div>
        </RebassProvider>
      </ReduxProvider>
    );
  }
}

App.propTypes = {
  seriesId: PropTypes.string,
  store: PropTypes.object
};

export default App;
