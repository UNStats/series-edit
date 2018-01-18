import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addDimension, fetchDimensions } from "../actions/dimensionActions";
import getSelectableDimensions from "../selectors/selectableDimensionsSelector";
import { Dropdown } from "@unstats/components";

// Connect Dropdown to Redux store. Access to lifecycle methods is required to
// dispatch action to fetch initial options.

class SelectableDimensions extends Component {
  componentDidMount() {
    const { dispatch, seriesId } = this.props;
    dispatch(fetchDimensions(seriesId));
  }

  render() {
    const { options, disabled, seriesId, dispatch } = this.props;
    return (
      <Dropdown
        options={options}
        disabled={disabled}
        onChange={dimensionId => dispatch(addDimension(seriesId, dimensionId))}
      />
    );
  }
}

SelectableDimensions.propTypes = {
  seriesId: PropTypes.string
};

// Subscribe to store.
const mapStateToProps = state => ({
  options: getSelectableDimensions(state),
  disabled: state.dimensions.selectable.fetching,
  seriesId: state.series.id
});

export default connect(mapStateToProps)(SelectableDimensions);
