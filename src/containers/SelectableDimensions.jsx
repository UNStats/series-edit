import React, { Component } from "react";
import { connect } from "react-redux";
import { Box } from "rebass";
import PropTypes from "prop-types";
import { addDimension, fetchDimensions } from "../actions/dimensionActions";
import getSelectableDimensions from "../selectors/selectableDimensionsSelector";
import { Dropdown } from "@unstats/components";

class SelectableDimensions extends Component {
  static propTypes = {
    seriesId: PropTypes.string.isRequired,
    dimensions: PropTypes.array.isRequired,
    disabled: PropTypes.bool.isRequired
  };

  componentDidMount() {
    const { dispatch, seriesId, dimensions } = this.props;
    // Fetch dimensions only if dimensions are empty.
    if (dimensions.length === 0) {
      dispatch(fetchDimensions(seriesId));
    }
  }

  render() {
    const { dimensions, disabled, dispatch } = this.props;
    return (
      <Box p={[1, 1, 2]}>
        <Dropdown
          options={dimensions}
          placeholder="Add dimension..."
          disabled={disabled}
          onChange={dimensionId => dispatch(addDimension(dimensionId))}
        />
      </Box>
    );
  }
}

const ConnectedSelectableDimensions = connect((state, { disabled }) => ({
  dimensions: getSelectableDimensions(state),
  disabled: state.disabled || disabled
}))(SelectableDimensions);

ConnectedSelectableDimensions.propTypes = {
  seriesId: PropTypes.string.isRequired,
  disabled: PropTypes.bool
};

ConnectedSelectableDimensions.defaultProps = {
  disabled: false
};

export default ConnectedSelectableDimensions;
