import React from "react";
import ReactDOM from "react-dom";
import Controls from "./Controls";
import Loading from "./Loading";
import AllCountries from "./AllCountries";
import SingleCountries from "./SingleCountries";


// set some default values for all charts
// no further default possible, to different :/

import { defaults } from 'react-chartjs-2';
//console.log(defaults.global.tooltips);
defaults.global.tooltips.mode = 'index';
defaults.global.tooltips.intersect = false;
defaults.global.tooltips.position = 'nearest';
defaults.global.tooltips.xPadding = 10;
defaults.global.tooltips.yPadding = 10;

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

    this.handleFetch = this.handleFetch.bind(this);

    this.renderYearsArray = this.renderYearsArray.bind(this);
    this.calculateTotalPopulation = this.calculateTotalPopulation.bind(this);
    this.handleCountrySelect = this.handleCountrySelect.bind(this);
    this.handleControles = this.handleControles.bind(this);

    // 3 arrays: one with all the countries, one with all the years (20) for single and one with all the years for all
    // (the api only provides a limited amount of available years!!!)
    this.countries = [
      'Belgium', 'France', 'Luxembourg', 'Germany', 'The Netherlands', 'Spain', 'Italy', 'Greece',
      'Portugal', 'Austria', 'Denmark', 'Norway', 'Sweden', 'Finland', 'Ireland', 'Poland', 'Estonia',
      'Latvia', 'Lithuania', 'Slovak Republic', 'United Kingdom', 'Croatia', 'Serbia',
      'Bosnia and Herzegovina', 'Bulgaria', 'Czech Republic', 'Hungary', 'Slovenia', 'Switzerland2'
    ];
    this.years4Single = this.renderYearsArray(20);
    this.years4All = this.renderYearsArray(5);
  }

  // make an array for all the years between 2018 - 20 years
  renderYearsArray(num){
    let years = [];
    for(let i = 0; i < num; i++){
      years.push(2018 - i);
    }
    // remove this
    //years.push(1860)
    return years;
  }

  // calculate the total population of a given country
  calculateTotalPopulation(arr){
    return arr.reduce((acc, curr) => acc + curr.total, 0);
  }

  // this does the fetch to the api
  doFetch(arr, param){
    return arr.map(item => {
      // all countries in 2018 -> state.view all
      // http://api.population.io/1.0/population/${country}/2018-01-01/ -> min 2013 !!!
      // all years -> state.view single
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


  handleFetch(){

    // while loading data
    this.setState({ isLoading: true });
    console.log('isLoading', this.state.data);

    // 2 cases:
    // view all
    // all the countries -> the total population -> 2018
    // http://api.population.io/1.0/population/Belgium/2018-01-01/
    // view single
    // one country -> 20 years
    // http://api.population.io/1.0/population/2018/Belgium/


    const fetchArray = (this.state.view === 'all') ? this.countries : this.years4Single;
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
              { 'countryName': fetchArray[i], 'population': undefined, 'datatype' : 'all' } :
              { 'year': fetchArray[i], 'population': undefined, 'datatype' : 'single' };
          }else{ // else return the data
            return (this.state.view === 'all') ?
              { 'countryName': fetchArray[i], 'population': value.total_population.population, 'datatype' : 'all' } :
              { 'year': fetchArray[i], 'population': value, 'datatype' : 'single' };
          }
        });
      //console.log(combinedData)
      this.setState({
        data: combinedData,
        // data was loaded
        isLoading: false
      });
      console.log('LoadingDone', this.state.data);
    })
    .catch(error => this.setState({ error: error, isLoading: false }));


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

      // if the view changes from single to all there is a potential problem
      // because the all view is only available 2013+ (single 1998+)
      // so we need to handle this
      const oldView = this.state.view;
      const oldYear = +this.state.year;
      if(oldView === 'single' && oldYear < 2014){
        this.setState({
          view: 'all',
          country: '',
          year: 2014
        });
      }else{
        this.setState({
          view: 'all',
          country: '',
        });
      }

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

  checkData(data){
    if(data.length === 0){
      return 'no data';
    }else if(data[0].datatype === 'all'){
      return 'all';
    }else if(data[0].datatype === 'single'){
      return 'single';
    }else{
      return 'error';
    }
  }

  getCountryFromData(data){
    // this function is only called after checkData is OK
    // key must be year or country
    return data[data.length - 1].population[0].country;
  }


  componentDidMount() {
    //console.log('comp did mount ran');
    this.handleFetch();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.country !== prevState.country || this.state.view !== prevState.view) {
      this.handleFetch();
    }
  }

  render(){

    // if isLoading = true it means that there's a problem
    // the new data hasn't arrived yet but the new components are getting mounted
    // so the new comps get fed the wrong data => errors
    // we solve this by checking the data
    // if the datastructure doesn't correspond to the state.view we keep showing the old component while the data loads
    // also expect no data yet (first load)
    const dataType = this.checkData(this.state.data);

    return (
      <div className="container">
        <p>All countries > Country: {this.state.country}, Year: {this.state.year}. isLoading: {this.state.isLoading ? 'yes' : 'no'}</p>
        <Controls
          view={this.state.view}
          country={this.state.country} countries={this.countries}
          year={this.state.year}
          years4Single={this.years4Single}
          years4All={this.years4All}
          handleControles={this.handleControles} />

        {this.state.isLoading && <Loading />}

        {dataType === 'all' &&
          <AllCountries data={this.state.data} handleCountrySelect={this.handleCountrySelect} ref={this.countryOverviewRef} />}
        {dataType === 'single' &&
          <SingleCountries
            data={this.state.data}
            year={this.state.year}
            country={this.getCountryFromData(this.state.data)} />}

      </div>
    );
  };
};

export default ChartApp;

ReactDOM.render(<ChartApp />, document.getElementById("chartApp"));
