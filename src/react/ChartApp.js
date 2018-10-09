import React from "react";
import ReactDOM from "react-dom";
import Test from "./Test";

class ChartApp extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      view: 'all', // all - single
      country: 'Belgium',
      year: 2018,
      isLoading: true,
      data: [],
      error: false
    }
    //this.endpoint =
    this.renderYearsArray = this.renderYearsArray.bind(this);
    this.calculateTotalPopulation = this.calculateTotalPopulation.bind(this);
    this.countries = [
      'Belgium', 'France', 'Luxembourg', 'Germany', 'The Netherlands', 'Spain', 'Italy', 'Greece',
      'Portugal', 'Austria', 'Denmark', 'Norway', 'Sweden', 'Finland', 'Ireland', 'Poland', 'Estonia',
      'Latvia', 'Lithuania', 'Slovak Republic', 'United Kingdom', 'Croatia', 'Serbia',
      'Bosnia and Herzegovina', 'Bulgaria', 'Czech Republic', 'Hungary', 'Slovenia', 'Switzerland2'
    ];
    this.years = this.renderYearsArray();
  }

  // make an array for all the years between 2018 - 20 years
  renderYearsArray(){
    let years = [];
    for(let i = 0; i < 20; i++){
      years.push(2018 - i);
    }
    // remove this
    years.push(1860)
    return years;
  }

  // calculate the total population of a given country
  calculateTotalPopulation(arr){
    return arr.reduce((acc, curr) => acc + curr.total, 0);
  }

  // this does the fetch to the api
  doFetch(arr, param){
    return arr.map(item => {
      // all countries in 2018
      // http://api.population.io/1.0/population/${country}/2018-01-01/
      // all years
      // http://api.population.io/1.0/population/${year}/Belgium/
      const endpoint = `http://api.population.io/1.0/population/${item}/${param}/`;
      return fetch(endpoint)
        .then(response => {
          // return false as value if the response was not ok
          return response.ok ? response.json() : false;
        })
    });
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    // 2 cases:
    // view all
    // all the countries -> the total population -> 2018
    // http://api.population.io/1.0/population/Belgium/2018-01-01/
    // view single
    // one country -> 20 years
    // http://api.population.io/1.0/population/2018/Belgium/

    const fetchArray = (this.state.view === 'all') ? this.countries : this.years;
    const fetchParam = (this.state.view === 'all') ? `${this.state.year}-01-01` : this.state.country;
    const fetch = this.doFetch(fetchArray, fetchParam);
    //console.log(fetchArray, fetchParam, fetch);

    Promise.all(fetch)
      .then( values => {
        const combinedData = values.map((value, i) => {
        //console.log(value);

        if(!value){ // if there was no response, return undefined as data
          return (this.state.view === 'all') ?
            { 'countryName': fetchArray[i], 'population': undefined } :
            { 'year': fetchArray[i], 'population': undefined };
        }else{ // else return the data
          return (this.state.view === 'all') ?
            { 'countryName': fetchArray[i], 'population': value.total_population.population } :
            { 'year': fetchArray[i], 'population': value };
        }
      });
      this.setState({
        data: combinedData
      });
    })
    .catch(error => this.setState({ error: error, isLoading: false }));

  }

  render(){
    //console.log('state data', this.state.data);
    //const totalPop = this.calculateTotalPopulation(this.state.data);
    return (
      <div>
        <p>Country: {this.state.country}, Year: {this.state.year}.</p>
        <Test data={this.state.data} />
      </div>
    );
  };
};

export default ChartApp;

ReactDOM.render(<ChartApp />, document.getElementById("chartApp"));
