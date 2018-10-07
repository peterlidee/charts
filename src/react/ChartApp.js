import React from "react";
import ReactDOM from "react-dom";

class ChartApp extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      country: 'Belgium',
      year: 2018,
      isLoading: true,
      data: [],
      error: false
    }
    //this.endpoint =
    this.getCountryData = this.getCountryData.bind(this);
    this.calculateTotalPopulation = this.calculateTotalPopulation.bind(this);
  }

  getCountryData(country, year){
    const endpoint = `http://api.population.io/1.0/population/${year}/${country}/`;
    const result = [];
    fetch(endpoint)
      .then(response => {
        response.json().then((data) => {
          result.push(...data);
        });
      }).catch(function(err) {
        //console.log('Fetch Error :-S', err);
        result.push(false);
    });
    //console.log('data gotten');
    //return result;
  }

  // calculate the total population of a given country
  calculateTotalPopulation(arr){
    return arr.reduce((acc, curr) => acc + curr.total, 0);
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    fetch(`http://api.population.io/1.0/population/${this.state.year}/${this.state.country}/`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then(data => this.setState({ data: data, isLoading: false }))
      .catch(error => this.setState({ error: error, isLoading: false }));
  }

  render(){
    console.log('state data', this.state.data);
    const totalPop = this.calculateTotalPopulation(this.state.data);
    return (
      <div>
        <p>total pop of {this.state.country} is {totalPop}</p>
      </div>
    );
  };
};

export default ChartApp;

ReactDOM.render(<ChartApp />, document.getElementById("chartApp"));
