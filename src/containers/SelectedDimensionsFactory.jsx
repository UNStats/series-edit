import React, { Component } from "react";
import { connect } from "react-redux";
import { Box, ButtonOutline, Flex } from "rebass";
import PropTypes from "prop-types";
import { removeDimension } from "../actions/dimensionActions";
import DimensionFactory from "./DimensionFactory";

const SelectedDimensionsFactory = seriesId => {
  return class SelectedDimensions extends Component {
    static propTypes = {
      disabled: PropTypes.bool.isRequired,
      dimensions: PropTypes.array.isRequired,
      onRemoveDimension: PropTypes.func.isRequired
    };

    constructor(props) {
      super(props);
      this.handleRemoveDimension = this.handleRemoveDimension.bind(this);
    }

    handleRemoveDimension(event) {
      event.preventDefault();
      this.props.onRemoveDimension(event.target.value);
    }

    render() {
      const { disabled, dimensions } = this.props;
      return (
        <Box>
          {dimensions.map(dimension => {
            const Dimension = DimensionFactory(seriesId, dimension.id);
            return (
              <Flex
                key={dimension.id}
                direction={["column", "column", "row-reverse"]}
                justify="space-between"
                align={["stretch", "stretch", "flex-start"]}
                mb={2}
              >
                <Box p={[1, 1, 2]} flex={2}>
                  <Dimension name={dimension.name} disabled={disabled} />
                </Box>
                <Box p={[1, 1, 2]}>
                  <ButtonOutline
                    value={dimension.id}
                    disabled={disabled}
                    onClick={this.handleRemoveDimension}
                  >
                    Remove
                  </ButtonOutline>
                </Box>
              </Flex>
            );
          })}
        </Box>
      );
    }
  };
};

const ConnectedSelectedDimensionsFactory = seriesId => {
  const ConnectedSelectedDimensions = connect(
    (state, { disabled }) => ({
      dimensions: state.dimensions.selected,
      disabled: state.disabled || disabled
    }),
    dispatch => ({
      onRemoveDimension: dimensionId => dispatch(removeDimension(dimensionId))
    })
  )(SelectedDimensionsFactory(seriesId));

  ConnectedSelectedDimensions.propTypes = {
    disabled: PropTypes.bool
  };

  ConnectedSelectedDimensions.defaultProps = {
    disabled: false
  };

  return ConnectedSelectedDimensions;
};

export default ConnectedSelectedDimensionsFactory;
