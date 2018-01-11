import React, { Component } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { Provider as RebassProvider } from "rebass";
import SelectableDimensions from "./SelectableDimensions";
import SelectedDimensions from "./SelectedDimensions";

class App extends Component {
  render() {
    return (
      <ReduxProvider store={this.props.store}>
        <RebassProvider>
          <div>
            <SelectableDimensions />
            <SelectedDimensions />
          </div>
        </RebassProvider>
      </ReduxProvider>
    );
  }
}

export default App;
