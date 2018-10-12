import React from "react";
import ReactDOM from "react-dom";
import Controls from "./Controls";
import CountryOverview from "./CountryOverview";
import SingleCountry from "./SingleCountry";

class ChartApp extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      view: 'single', // all - single
      country: 'Belgium',
      year: 2018,
      isLoading: true,
      data: [],
      error: false
    }
    this.countryOverviewRef = React.createRef();
    this.renderYearsArray = this.renderYearsArray.bind(this);
    this.calculateTotalPopulation = this.calculateTotalPopulation.bind(this);
    this.handleCountrySelect = this.handleCountrySelect.bind(this);
    this.handleControles = this.handleControles.bind(this);

    // 2 arrays: one with all the countries, one with all the years (20)
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
      //console.log(endpoint);
      return fetch(endpoint)
        .then(response => {
          // return false as value if the response was not ok
          return response.ok ? response.json() : false;
        })
    });
  }

  handleCountrySelect(){
    // this handles 2 events: click on tick label or click on bar
    // get the ref inside the ref
    const ref = this.countryOverviewRef.current.horizontalBarRef.current;
    const tickLabel = ref.chartInstance.labelTick;
    const barLabel = ref.chartInstance.labelBar;

    if(tickLabel){ this.setState({ country: tickLabel, view: 'single', })};
    if(barLabel){ this.setState({ country: barLabel, view: 'single', })};

  }
  handleControles(e){
    //console.log(e.target);
    if(e.target.id === 'all' || e.target.id === 'clear'){
      this.setState({
        view: 'all',
        country: '',
      });
    }else if(e.target.id === 'year'){
      this.setState({
        year: e.target.value
      });
    }else if(e.target.id === 'country'){
      this.setState({
        view: 'single',
        country: e.target.value
      });
    }
  }

  componentDidMount() {
    //console.log('comp did mount ran');
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
            //console.log(value)
            return (this.state.view === 'all') ?
              { 'countryName': fetchArray[i], 'population': undefined } :
              { 'year': fetchArray[i], 'population': undefined };
          }else{ // else return the data
            return (this.state.view === 'all') ?
              { 'countryName': fetchArray[i], 'population': value.total_population.population } :
              { 'year': fetchArray[i], 'population': value };
          }
        });
      //console.log(combinedData)
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
        <p>All countries > Country: {this.state.country}, Year: {this.state.year}.</p>
        <Controls
          view={this.state.view}
          country={this.state.country} countries={this.countries}
          year={this.state.year} years={this.years}
          handleControles={this.handleControles} />
        {this.state.view === 'all' &&
          <CountryOverview data={this.state.data} handleCountrySelect={this.handleCountrySelect} ref={this.countryOverviewRef} />
        }
        {this.state.view === 'single' &&
          <SingleCountry data={this.state.data} />
        }
      </div>
    );
  };
};

export default ChartApp;

ReactDOM.render(<ChartApp />, document.getElementById("chartApp"));
