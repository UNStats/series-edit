import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  fetchDimensionValues,
  addDimensionValue,
  removeDimensionValue
} from "../actions/dimensionValueActions";
import getSelectableDimensionValues from "../selectors/selectableDimensionValuesSelector";
import getSelectedDimensionValues from "../selectors/selectedDimensionValuesSelector";
import isSelectedDimensionDisabled from "../selectors/isSelectedDimensionDisabledSelector";
import { ValuePicker } from "@unstats/components";

class Dimension extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    selectable: PropTypes.array.isRequired,
    selected: PropTypes.array.isRequired,
    onAddValue: PropTypes.func.isRequired,
    onRemoveValue: PropTypes.func.isRequired,
    fetchDimensionValues: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { selectable, fetchDimensionValues } = this.props;
    // Fetch dimension values only if selectable values are empty.
    if (selectable.length === 0) {
      fetchDimensionValues();
    }
  }

  render() {
    const {
      name,
      disabled,
      selectable,
      selected,
      onAddValue,
      onRemoveValue
    } = this.props;
    return (
      <ValuePicker
        title={name}
        disabled={disabled}
        selectable={selectable}
        selected={selected}
        onAddValue={onAddValue}
        onRemoveValue={onRemoveValue}
      />
    );
  }
}

const ConnectedDimensionFactory = (seriesId, dimensionId) => {
  const ConnectedDimension = connect(
    (state, { disabled }) => ({
      disabled: isSelectedDimensionDisabled(dimensionId)(state) || disabled,
      selectable: getSelectableDimensionValues(dimensionId)(state),
      selected: getSelectedDimensionValues(dimensionId)(state)
    }),
    dispatch => ({
      onAddValue: valueId => dispatch(addDimensionValue(dimensionId, valueId)),
      onRemoveValue: valueId =>
        dispatch(removeDimensionValue(dimensionId, valueId)),
      fetchDimensionValues: () =>
        dispatch(fetchDimensionValues(seriesId, dimensionId))
    })
  )(Dimension);

  ConnectedDimension.propTypes = {
    name: PropTypes.string.isRequired,
    disabled: PropTypes.bool
  };

  ConnectedDimension.defaultProps = {
    disabled: false
  };

  return ConnectedDimension;
};

export default ConnectedDimensionFactory;