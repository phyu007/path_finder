import React from "react";
import ReactDOM from "react-dom";
import { IntlProvider } from "react-intl";

import messages from "./i18n/en-gb.json";
import App from "./app";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <IntlProvider locale="en-gb" messages={messages}>
    <App />
  </IntlProvider>,
  rootElement
);
