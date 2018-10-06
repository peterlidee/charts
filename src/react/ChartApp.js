import React from "react";
import ReactDOM from "react-dom";

class ChartApp extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div>
        <p>React here!</p>
      </div>
    );
  };
};

export default ChartApp;

ReactDOM.render(<ChartApp />, document.getElementById("chartApp"));
