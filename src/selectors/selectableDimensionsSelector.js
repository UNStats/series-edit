import { createSelector } from "reselect";

/**
 * Map selectable dimensions to array that is compatible with Dropdown
 * component.
 */
const selector = createSelector(
  state => state.dimensions.selectable,
  selectable =>
    selectable.map(dimension => ({ key: dimension.id, value: dimension.name }))
);

export default selector;
