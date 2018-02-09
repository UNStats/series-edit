import React, { Component } from "react";
import { connect } from "react-redux";
import { Box } from "rebass";
import PropTypes from "prop-types";
import { addDimension, fetchDimensions } from "../actions/dimensionActions";
import getSelectableDimensions from "../selectors/selectableDimensionsSelector";
import { Dropdown } from "@unstats/components";

class SelectableDimensions extends Component {
  static propTypes = {
    dimensions: PropTypes.array.isRequired,
    disabled: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    fetchDimensions: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { dimensions, fetchDimensions } = this.props;
    // Fetch dimensions only if dimensions are empty.
    if (dimensions.length === 0) {
      fetchDimensions();
    }
  }

  render() {
    const { dimensions, disabled, onChange } = this.props;
    return (
      <Box p={[1, 1, 2]}>
        <Dropdown
          options={dimensions}
          placeholder="Add dimension..."
          disabled={disabled}
          onChange={onChange}
        />
      </Box>
    );
  }
}

const ConnectedSelectableDimensionsFactory = seriesId => {
  const ConnectedSelectableDimensions = connect(
    (state, { disabled }) => ({
      dimensions: getSelectableDimensions(state),
      disabled: state.disabled || disabled
    }),
    dispatch => ({
      onChange: dimensionId => dispatch(addDimension(dimensionId)),
      fetchDimensions: () => dispatch(fetchDimensions(seriesId))
    })
  )(SelectableDimensions);

  ConnectedSelectableDimensions.propTypes = {
    disabled: PropTypes.bool
  };

  ConnectedSelectableDimensions.defaultProps = {
    disabled: false
  };

  return ConnectedSelectableDimensions;
};

export default ConnectedSelectableDimensionsFactory;
