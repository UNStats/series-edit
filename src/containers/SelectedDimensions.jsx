import { connect } from "react-redux";
import { removeDimension } from "../actions/dimensionActions";
import {
  addDimensionValue,
  removeDimensionValue
} from "../actions/dimensionValueActions";
import getSelectedDimensions from "../selectors/selectedDimensionsSelector";
import ValuePickerList from "../components/ValuePickerList";

// This component connects the Redux store to the ValuePickerList component.

// `list` array has shape required by `ValuePickerList` except for handlers.
const mapStateToProps = state => ({
  list: getSelectedDimensions(state),
  seriesId: state.series.id
});

// Parametrized handlers that need to be processed in `mergeProps`.
const mapDispatchToProps = dispatch => ({
  onAddValueCreator: (seriesId, dimensionId) => valueId =>
    dispatch(addDimensionValue(seriesId, dimensionId, valueId)),
  onRemoveValueCreator: (seriesId, dimensionId) => valueId =>
    dispatch(removeDimensionValue(seriesId, dimensionId, valueId)),
  onRemoveValuePickerCreator: seriesId => dimensionId =>
    dispatch(removeDimension(seriesId, dimensionId))
});

const mergeProps = (stateProps, actionProps) => {
  const { seriesId, list } = stateProps;
  const {
    onAddValueCreator,
    onRemoveValueCreator,
    onRemoveValuePickerCreator
  } = actionProps;
  return {
    list: list.map(dimension => ({
      ...dimension,
      onAddValue: onAddValueCreator(seriesId, dimension.key),
      onRemoveValue: onRemoveValueCreator(seriesId, dimension.key)
    })),
    onRemoveValuePicker: onRemoveValuePickerCreator(seriesId)
  };
};

const SelectedDimensions = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ValuePickerList);

export default SelectedDimensions;
