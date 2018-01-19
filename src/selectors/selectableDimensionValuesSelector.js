import { createSelector } from "reselect";

/**
 * Map selectable values for a dimension of selected dimensions to array that
 * is compatible with Dropdown component.
 */
const selector = dimensionId =>
  createSelector(
    state => state.dimensions.selected,
    selectedDimensions => {
      const index = selectedDimensions.findIndex(
        dimension => dimension.id === dimensionId
      );
      return selectedDimensions[index].selectable.map(dimensionValue => ({
        key: dimensionValue.id,
        value: dimensionValue.value
      }));
    }
  );

export default selector;
