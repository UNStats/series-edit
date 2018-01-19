import { createSelector } from "reselect";

/**
 * Map selected values for a dimension of selected dimensions to array that
 * is compatible with Tags component.
 */
const selector = dimensionId =>
  createSelector(
    state => state.dimensions.selected,
    selectedDimensions => {
      const index = selectedDimensions.findIndex(
        dimension => dimension.id === dimensionId
      );
      return selectedDimensions[index].selected.map(dimensionValue => ({
        key: dimensionValue.id,
        value: dimensionValue.value
      }));
    }
  );

export default selector;
