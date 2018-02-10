import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import AppFactory from "./containers/AppFactory";
import reducer from "./reducers";

const seriesId = window.seriesId;
delete window.seriesId;
const token = window.token;
delete window.token;
const preloadedState = window.preloadedState;
delete window.preloadedState;

const middleware = [thunk];
const store = createStore(
  reducer,
  preloadedState,
  composeWithDevTools(applyMiddleware(...middleware))
);

const App = AppFactory(seriesId, token);

ReactDOM.render(<App store={store} />, document.getElementById("root"));
