import {createSelector} from "reselect"

/**
 * Create memoized array from store. Each element is a selected dimension
 * represented as object with key, title, selected and selectable properties.
 * The resulting array is compatible with the ValuePickerList.
 */
const selectedDimensionsSelector = createSelector(
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
)

export default selectedDimensionsSelector
