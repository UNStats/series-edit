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
import { ValuePicker } from "@unstats/components";

class Dimension extends Component {
  componentDidMount() {
    const { dispatch, seriesId, dimensionId } = this.props;
    dispatch(fetchDimensionValues(seriesId, dimensionId));
  }

  render() {
    const { name, selectable, selected, dimensionId, dispatch } = this.props;
    return (
      <ValuePicker
        title={name}
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

// Subscribe to store.
const mapStateToProps = (state, props) => ({
  selectable: getSelectableDimensionValues(props.dimensionId)(state),
  selected: getSelectedDimensionValues(props.dimensionId)(state)
});

const ConnectedDimension = connect(mapStateToProps)(Dimension);

ConnectedDimension.propTypes = {
  name: PropTypes.string,
  seriesId: PropTypes.string,
  dimensionId: PropTypes.string
};

export default ConnectedDimension;
