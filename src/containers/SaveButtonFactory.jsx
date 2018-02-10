import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Box, Button } from "rebass";
import { saveSeries } from "../actions/seriesActions";

const SaveButton = ({ disabled, onClick }) => (
  <Box p={[1, 1, 2]}>
    <Button width={1} disabled={disabled} onClick={onClick}>
      Save
    </Button>
  </Box>
);

SaveButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

const ConnectedSaveButtonFactory = (seriesId, token) => {
  const ConnectedSaveButton = connect(
    (state, { disabled }) => ({
      disabled: state.disabled || !state.dirty || disabled
    }),
    // Bake seriedId into handler.
    dispatch => ({
      onClick: () => dispatch(saveSeries(seriesId, token))
    })
  )(SaveButton);

  ConnectedSaveButton.propTypes = {
    disabled: PropTypes.bool
  };

  ConnectedSaveButton.defaultProps = {
    disabled: false
  };

  return ConnectedSaveButton;
};

export default ConnectedSaveButtonFactory;
