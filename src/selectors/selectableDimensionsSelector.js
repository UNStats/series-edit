import {createSelector} from "reselect"

/**
 * Create memoized array from store. Each element is a selectable dimension
 * represented as key/value pair. The resulting array is compatible with the
 * Dropdown component.
 */
const selectableDimensionsSelector = createSelector(
  state => state.dimensions.selectable,
  selectable =>
    selectable.map(dimension => ({key: dimension.id, value: dimension.name}))
)

export default selectableDimensionsSelector
