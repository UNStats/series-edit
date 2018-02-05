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
    seriesId: PropTypes.string.isRequired,
    dimensionId: PropTypes.string.isRequired,
    selectable: PropTypes.array.isRequired,
    selected: PropTypes.array.isRequired
  };

  componentDidMount() {
    const { dispatch, seriesId, dimensionId, selectable } = this.props;
    // Fetch dimension values only if selectable values are empty.
    if (selectable.length === 0) {
      dispatch(fetchDimensionValues(seriesId, dimensionId));
    }
  }

  render() {
    const {
      name,
      disabled,
      selectable,
      selected,
      dimensionId,
      dispatch
    } = this.props;
    return (
      <ValuePicker
        title={name}
        disabled={disabled}
        selectable={selectable}
        selected={selected}
        onAddValue={valueId =>
          dispatch(addDimensionValue(dimensionId, valueId))
        }
        onRemoveValue={valueId =>
          dispatch(removeDimensionValue(dimensionId, valueId))
        }
      />
    );
  }
}

const ConnectedDimension = connect((state, { disabled, dimensionId }) => ({
  disabled: isSelectedDimensionDisabled(dimensionId)(state) || disabled,
  selectable: getSelectableDimensionValues(dimensionId)(state),
  selected: getSelectedDimensionValues(dimensionId)(state)
}))(Dimension);

ConnectedDimension.propTypes = {
  name: PropTypes.string.isRequired,
  seriesId: PropTypes.string.isRequired,
  dimensionId: PropTypes.string.isRequired
};

ConnectedDimension.defaultProps = {
  disabled: false
};

export default ConnectedDimension;
