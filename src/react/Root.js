import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import ChartApp from "./ChartApp";

const Root = () => {
  return(
    <BrowserRouter>
      <ChartApp />
    </BrowserRouter>
  )
}

export default Root;

ReactDOM.render(<Root />, document.getElementById("chartApp"));
