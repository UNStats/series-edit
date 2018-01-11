import React from "react";
import { Box, Provider } from "rebass";

export default ({ children }) => (
  <Provider>
    <Box p={1}>{children}</Box>
  </Provider>
);
