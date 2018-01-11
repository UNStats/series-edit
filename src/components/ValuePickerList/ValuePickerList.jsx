import React, { Component } from "react";
import PropTypes from "prop-types";
import { Box, ButtonOutline, Flex } from "rebass";
import { ValuePicker } from "@unstats/components";

class ValuePickerList extends Component {
  constructor(props) {
    super(props);
    this.handleAddValuePicker = this.handleAddValuePicker.bind(this);
    this.handleRemoveValuePicker = this.handleRemoveValuePicker.bind(this);
  }

  handleAddValuePicker(event) {
    event.preventDefault();
    this.props.onAddValuePicker(event.target.value);
  }

  handleRemoveValuePicker(event) {
    event.preventDefault();
    this.props.onRemoveValuePicker(event.target.value);
  }

  render() {
    return (
      <Box>
        {this.props.list.map(item => {
          const { key, ...rest } = item;
          return (
            <Flex
              key={key}
              direction={["column", "column", "row-reverse"]}
              justify="space-between"
              align={["stretch", "stretch", "flex-start"]}
              mb={2}
            >
              <Box p={[1, 1, 2]} flex={2}>
                <ValuePicker {...rest} />
              </Box>
              <Box p={[1, 1, 2]}>
                <ButtonOutline
                  value={key}
                  onClick={this.handleRemoveValuePicker}
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

ValuePickerList.propTypes = {
  /**
   * Array with properties to instantiate a list of ValuePickers.
   */
  list: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      selected: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string,
          value: PropTypes.string
        })
      ).isRequired,
      selectable: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string,
          value: PropTypes.string
        })
      ).isRequired,
      onAddValue: PropTypes.func.isRequired,
      onRemoveValue: PropTypes.func.isRequired
    })
  ).isRequired,
  /** Callback fires when clicking a value picker's remove button. */
  onRemoveValuePicker: PropTypes.func.isRequired
};

export default ValuePickerList;
