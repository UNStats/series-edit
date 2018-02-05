import { createSelector } from "reselect";

/**
 * Get disabled flag for a selected dimension.
 */
const selector = dimensionId =>
  createSelector(
    state => state.dimensions.selected,
    selectedDimensions => {
      const index = selectedDimensions.findIndex(
        dimension => dimension.id === dimensionId
      );
      if (index < 0) {
        return undefined;
      }
      return selectedDimensions[index].disabled;
    }
  );

export default selector;
