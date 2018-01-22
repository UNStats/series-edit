import React, { Component } from "react";
import { connect } from "react-redux";
import { Box } from "rebass";
import { addDimension, fetchDimensions } from "../actions/dimensionActions";
import getSelectableDimensions from "../selectors/selectableDimensionsSelector";
import { Dropdown } from "@unstats/components";

class SelectableDimensions extends Component {
  componentDidMount() {
    const { dispatch, seriesId } = this.props;
    dispatch(fetchDimensions(seriesId));
  }

  render() {
    const { options, disabled, seriesId, dispatch } = this.props;
    return (
      <Box p={[1, 1, 2]}>
        <Dropdown
          options={options}
          placeholder="Add dimension..."
          disabled={disabled}
          onChange={dimensionId =>
            dispatch(addDimension(seriesId, dimensionId))
          }
        />
      </Box>
    );
  }
}

// Subscribe to store.
const mapStateToProps = state => ({
  options: getSelectableDimensions(state),
  disabled: state.dimensions.selectable.fetching,
  seriesId: state.series.id
});

export default connect(mapStateToProps)(SelectableDimensions);
