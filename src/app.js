import React from "react";

import GlobalStyles from "./global-styles";
import Container from "./containers";

const App = () => {
  return (
    <div className="app">
      <Container />
      <GlobalStyles />
      <img src="assets/sg-bg.jpg" id="bg" alt="" />
    </div>
  );
};

export default App;
