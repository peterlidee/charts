import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import ChartApp from "./react/ChartApp";

import style from "./sass/main.scss";

const Root = () => {
  {/*}<BrowserRouter>
    <ChartApp />
  </BrowserRouter>{*/}
  return(
    <BrowserRouter>
      <ChartApp />
    </BrowserRouter>
  )
}

export default Root;

ReactDOM.render(<Root />, document.getElementById("chartApp"));
