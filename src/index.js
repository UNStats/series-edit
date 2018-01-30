import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import App from "./containers/App";
import reducer from "./reducers";

const seriesId = window.seriesId;
delete window.seriesId;
const preloadedState = window.preloadedState;
delete window.preloadedState;

const middleware = [thunk];
const store = createStore(
  reducer,
  preloadedState,
  composeWithDevTools(applyMiddleware(...middleware))
);

ReactDOM.render(
  <App seriesId={seriesId} store={store} />,
  document.getElementById("root")
);
