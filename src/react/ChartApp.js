import React from "react";
import ReactDOM from "react-dom";

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
    this.getCountryData = this.getCountryData.bind(this);
    this.calculateTotalPopulation = this.calculateTotalPopulation.bind(this);
    this.countries = [
      'Belgium', 'France', 'Luxembourg', 'Germany', 'The Netherlands', 'Spain', 'Italy', 'Greece',
      'Portugal', 'Austria', 'Denmark', 'Norway', 'Sweden', 'Finland', 'Ireland', 'Poland', 'Estonia',
      'Czech Republic', 'Latvia', 'Lithuania', 'Slovak Republic', 'United Kingdom', 'Croatia', 'Serbia',
      'Bosnia and Herzegovina', 'Bulgaria', 'Czech Republic', 'Hungary', 'Slovenia', 'Switzerland'
    ];
    this.countries2 = [
      'Belgium', 'France'
    ];
  }

  getCountryData(endpoint){
    //const endpoint = `http://api.population.io/1.0/population/${year}/${country}/`;
    //const endpoint = `http://api.population.io/1.0/population/${country}/${year}-01-01/`;
    /*const result = [];
    fetch(endpoint)
      .then(response => {
        response.json().then((data) => {
          result.push(...data);
        });
      }).catch(function(err) {
        //console.log('Fetch Error :-S', err);
        result.push(false);
    });*/


    fetch(endpoint)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then(data => this.setState({ data: data, isLoading: false }))
      .catch(error => this.setState({ error: error, isLoading: false }));

    //console.log('data gotten');
    //return result;
  }

  // calculate the total population of a given country
  calculateTotalPopulation(arr){
    return arr.reduce((acc, curr) => acc + curr.total, 0);
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    /*if(this.state.view === 'all'){
      // get the total population for each country
      const endpoint = `http://api.population.io/1.0/population/${this.state.country}/${this.state.year}-01-01/`;
      this.countries.map(country => {
        const aCountry = this.getCountryData(endpoint);
        //console.log(aCountry);
      });
    }*/


    /*var apiRequest1 = fetch('http://api.population.io/1.0/population/Belgium/2018-01-01/').then(response => response.json());
    var apiRequest2 = fetch('http://api.population.io/1.0/population/France/2018-01-01/').then(response => response.json());
    //console.log(apiRequest1, apiRequest2);

    var combinedData = {"apiRequest1":{},"apiRequest2":{}};
    Promise.all([apiRequest1, apiRequest2]).then( values => {
        combinedData["apiRequest1"] = values[0];
        combinedData["apiRequest2"] = values[1];
        //return combinedData;
        console.log(combinedData);
    });*/

    const countriesRequests = this.countries.map(country => {
      return fetch(`http://api.population.io/1.0/population/${country}/2018-01-01/`).then(response => response.json());
    });
    console.log('cr', countriesRequests);

    var apiRequest1 = fetch('http://api.population.io/1.0/population/Belgium/2018-01-01/').then(response => response.json());
    var apiRequest2 = fetch('http://api.population.io/1.0/population/France/2018-01-01/').then(response => response.json());
    //console.log(apiRequest1, apiRequest2);

    //var combinedData = {"apiRequest1":{},"apiRequest2":{}};
    //const combinedData
    Promise.all(countriesRequests).then( values => {
        //console.log(values);
        const combinedData = values.map((value, i) => {
          console.log(value);
          return { countryName: this.countries[i], population: value.total_population.population };
        });
        //combinedData["apiRequest1"] = values[0];
        //combinedData["apiRequest2"] = values[1];
        //return combinedData;
        console.log(combinedData);
    });

    /*fetch(`http://api.population.io/1.0/population/${this.state.year}/${this.state.country}/`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then(data => this.setState({ data: data, isLoading: false }))
      .catch(error => this.setState({ error: error, isLoading: false }));*/
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
