import { connect } from "react-redux";
import { addDimension } from "../actions/dimensionActions";
import getSelectableDimensions from "../selectors/selectableDimensionsSelector";
import { Dropdown } from "@unstats/components";

// Connect Redux store to Dropdown component.

const mapStateToProps = state => ({
  options: getSelectableDimensions(state),
  disabled: state.dimensions.selectable.fetching,
  seriesId: state.series.id
});

// Parametrized handler that needs to be processed in `mergeProps`.
const mapDispatchToProps = dispatch => ({
  onChangeCreator: seriesId => dimensionId =>
    dispatch(addDimension(seriesId, dimensionId))
});

// Set `seriesId` for `onChange` handler.
const mergeProps = (stateProps, actionProps) => {
  const { seriesId, ...purgedStateProps } = stateProps;
  const { onChangeCreator } = actionProps;
  return {
    ...purgedStateProps,
    ...actionProps,
    onChange: onChangeCreator(seriesId)
  };
};

const SelectableDimensions = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Dropdown);

export default SelectableDimensions;
