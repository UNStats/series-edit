import React, { Component } from "react";
import { connect } from "react-redux";
import { Box, ButtonOutline, Flex } from "rebass";
import { removeDimension } from "../actions/dimensionActions";
import Dimension from "./Dimension";

class SelectedDimensions extends Component {
  constructor(props) {
    super(props);
    this.handleRemoveDimension = this.handleRemoveDimension.bind(this);
  }

  handleRemoveDimension(event) {
    event.preventDefault();
    this.props.onRemoveDimension(event.target.value);
  }

  render() {
    return (
      <Box>
        {this.props.dimensions.map(dimension => {
          return (
            <Flex
              key={dimension.id}
              direction={["column", "column", "row-reverse"]}
              justify="space-between"
              align={["stretch", "stretch", "flex-start"]}
              mb={2}
            >
              <Box p={[1, 1, 2]} flex={2}>
                <Dimension
                  name={dimension.name}
                  dimensionId={dimension.id}
                  seriesId={this.props.seriesId}
                />
              </Box>
              <Box p={[1, 1, 2]}>
                <ButtonOutline
                  value={dimension.id}
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
}

const mapStateToProps = state => ({
  dimensions: state.dimensions.selected,
  seriesId: state.series.id
});

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  onRemoveDimension: dimensionId =>
    dispatchProps.removeDimension(stateProps.seriesId, dimensionId)
});

export default connect(mapStateToProps, { removeDimension }, mergeProps)(
  SelectedDimensions
);
