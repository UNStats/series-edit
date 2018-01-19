import { createSelector } from "reselect";

/**
 * Map selected dimensions to array that is compatible with Dropdown component.
 */
const selector = createSelector(
  state => state.dimensions.selected,
  selected =>
    selected.map(dimension => ({
      key: dimension.id,
      title: dimension.name,
      selected: dimension.selected.map(value => ({
        key: value.id,
        value: value.value
      })),
      selectable: dimension.selectable.map(value => ({
        key: value.id,
        value: value.value
      }))
    }))
);

export default selector;
