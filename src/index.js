import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import ChartApp from "./react/ChartApp";

import style from "./sass/main.scss";

const Root = () => {
  return(
    <BrowserRouter basename="/charts">
      <ChartApp />
    </BrowserRouter>
  )
}

export default Root;

ReactDOM.render(<Root />, document.getElementById("chartApp"));
