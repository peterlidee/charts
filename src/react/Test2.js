import React from 'react';

class Test2 extends React.Component{

  render(){
    console.log(this.props);
    return <div className="chart__container">country: {this.props.match.params.country}</div>;
  }
}

export default Test2;
