import React, { Component } from "react";

import { connect } from "react-redux";
import { Box } from "rebass";
import PropTypes from "prop-types";
import { addDimension, fetchDimensions } from "../actions/dimensionActions";
import getSelectableDimensions from "../selectors/selectableDimensionsSelector";
import { Dropdown } from "@unstats/components";

class SelectableDimensions extends Component {
  componentDidMount() {
    const { dispatch, seriesId } = this.props;
    dispatch(fetchDimensions(seriesId));
  }

  render() {
    const { options, disabled, dispatch } = this.props;
    return (
      <Box p={[1, 1, 2]}>
        <Dropdown
          options={options}
          placeholder="Add dimension..."
          disabled={disabled}
          onChange={dimensionId => dispatch(addDimension(dimensionId))}
        />
      </Box>
    );
  }
}

// Subscribe to store.
const mapStateToProps = state => ({
  options: getSelectableDimensions(state),
  disabled: state.dimensions.selectable.fetching
});

const ConnectedSelectableDimensions = connect(mapStateToProps)(
  SelectableDimensions
);

ConnectedSelectableDimensions.propTypes = {
  seriesId: PropTypes.string
};

export default ConnectedSelectableDimensions;
