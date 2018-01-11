import {
  ADD_DIMENSION_VALUE,
  REMOVE_DIMENSION_VALUE,
  ADD_DIMENSION,
  REMOVE_DIMENSION,
  FETCH_DIMENSION_VALUES_FULFILLED,
  FETCH_DIMENSIONS_FULFILLED,
} from '../constants/ActionTypes';

const deepCopyDimension = dimension => ({
  ...dimension,
  selected: dimension.selected.map(value => ({ ...value })),
  selectable: dimension.selectable.map(value => ({ ...value })),
});

const deepCopyState = state => ({
  ...state,
  selected: state.selected.map(dimension => deepCopyDimension(dimension)),
  selectable: state.selectable.map(dimension => deepCopyDimension(dimension)),
});

/**
 * Check if `elements` contains element with matching `id`. Element can be
 * dimension or value.
 */
const getElementIndex = (elements, id) =>
  elements.findIndex(element => element.id === id);

/**
 * Immutable remove element from array.
 */
const removeElement = (array, index) => [
  ...array.slice(0, index),
  ...array.slice(index + 1),
];

const dimensionsReducer = (
  state = {
    selected: [],
    selectable: [],
  },
  action
) => {
  switch (action.type) {
    case ADD_DIMENSION_VALUE: {
      const { dimensionId, valueId } = action.payload;
      // Assert that dimension is in selected dimensions.
      const dimensionIndex = getElementIndex(state.selected, dimensionId);
      if (dimensionIndex < 0) {
        return state;
      }
      // Assert that value is in selected values.
      const valueIndex = getElementIndex(
        state.selected[dimensionIndex].selectable,
        valueId
      );
      if (valueIndex < 0) {
        return state;
      }
      const value = state.selected[dimensionIndex].selectable[valueIndex];
      // Ensure immutability: deep copy state, then alter.
      const deepCopiedState = deepCopyState(state);
      const dimension = deepCopiedState.selected[dimensionIndex];
      dimension.selectable = removeElement(dimension.selectable, valueIndex);
      dimension.selected = [...dimension.selected, { ...value }];
      return deepCopiedState;
    }
    case REMOVE_DIMENSION_VALUE: {
      const { dimensionId, valueId } = action.payload;
      // Assert that dimension is in selected dimensions.
      const dimensionIndex = getElementIndex(state.selected, dimensionId);
      if (dimensionIndex < 0) {
        return state;
      }
      // Assert that value is in selected values.
      const valueIndex = getElementIndex(
        state.selected[dimensionIndex].selected,
        valueId
      );
      if (valueIndex < 0) {
        return state;
      }
      // Ensure immutability: deep copy state, then alter.
      const deepCopiedState = deepCopyState(state);
      const value = state.selected[dimensionIndex].selected[valueIndex];
      const dimension = deepCopiedState.selected[dimensionIndex];
      dimension.selected = removeElement(dimension.selected, valueIndex);
      dimension.selectable = [...dimension.selectable, { ...value }];
      return deepCopiedState;
    }
    case ADD_DIMENSION: {
      const { dimensionId } = action.payload;
      // Assert that dimension is in selectable dimensions.
      const dimensionIndex = getElementIndex(state.selectable, dimensionId);
      if (dimensionIndex < 0) {
        return state;
      }
      // Ensure immutability: deep copy state, then alter.
      const deepCopiedState = deepCopyState(state);
      deepCopiedState.selectable = removeElement(
        deepCopiedState.selectable,
        dimensionIndex
      );
      deepCopiedState.selected = [
        ...deepCopiedState.selected,
        { ...state.selectable[dimensionIndex] },
      ];
      return deepCopiedState;
    }
    case REMOVE_DIMENSION: {
      const { dimensionId } = action.payload;
      // Assert that dimension is in selected dimensions.
      const dimensionIndex = getElementIndex(state.selected, dimensionId);
      if (dimensionIndex < 0) {
        return state;
      }
      // Ensure immutability: deep copy state, then alter.
      const deepCopiedState = deepCopyState(state);
      deepCopiedState.selected = removeElement(
        deepCopiedState.selected,
        dimensionIndex
      );
      deepCopiedState.selectable = [
        ...deepCopiedState.selectable,
        { ...state.selected[dimensionIndex], selected: [], selectable: [] },
      ];
      return deepCopiedState;
    }
    case FETCH_DIMENSION_VALUES_FULFILLED: {
      const { dimensionId, values } = action.payload;
      // Assert that dimension is in selected.
      const dimensionIndex = getElementIndex(state.selected, dimensionId);
      if (dimensionIndex < 0) {
        return state;
      }
      // Ensure immutability: deep copy state, then alter.
      const deepCopiedState = deepCopyState(state);
      const dimension = deepCopiedState.selected[dimensionIndex];
      // Not all values from the payload are selectable. Only those that are Not
      // in selected are selectable.
      const { selected } = state.selected[dimensionIndex];
      const selectable = values
        .filter(value => getElementIndex(selected, value.id) < 0)
        .map(value => ({ ...value }));
      dimension.selectable = selectable;
      return deepCopiedState;
    }
    case FETCH_DIMENSIONS_FULFILLED: {
      const { values: dimensions } = action.payload;
      // Ensure immutability: deep copy state, then alter.
      const deepCopiedState = deepCopyState(state);
      const { selected } = state;
      const selectable = dimensions
        .filter(dimension => getElementIndex(selected, dimension.id) < 0)
        .map(dimension => ({
          id: dimension.id,
          name: dimension.value,
          selected: [],
          selectable: [],
        }));
      deepCopiedState.selectable = selectable;
      return deepCopiedState;
    }
    default:
      return state;
  }
};

export default dimensionsReducer;
