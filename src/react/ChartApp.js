import React from "react";
import ReactDOM from "react-dom";
import { Switch, Route } from "react-router-dom";

import Controls from "./Controls";
import Loading from "./Loading";
import AllCountries from "./AllCountries";
import SelectCountry from "./SelectCountry";
import SingleCountries from "./SingleCountries";
import Footer from "./Footer";

import Test1 from "./Test1";
import Test2 from "./Test2";

import {renderYearsArray, getYearFromDate} from '../js/helpers.js';


// set some default values for all charts
// no further default possible, to different :/
import { defaults } from 'react-chartjs-2';
defaults.global.tooltips.mode = 'index';
defaults.global.tooltips.intersect = false;
defaults.global.tooltips.position = 'nearest';
defaults.global.tooltips.xPadding = 10;
defaults.global.tooltips.yPadding = 10;

class ChartApp extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      view: 'all', // all - single
      country: 'Belgium',
      year: 2018,
      isLoading: true,
      data: [],
      //error: false
    }
    this.countryOverviewRef = React.createRef();

    this.handleFetch = this.handleFetch.bind(this);
    this.handleCountrySelect = this.handleCountrySelect.bind(this);
    this.handleControles = this.handleControles.bind(this);

    // 3 arrays: one with all the countries, one with all the years (20) for single and one with all the years for all
    // (the api only provides a limited amount of available years!!!)
    this.countries = [
      'Belgium', 'France', 'Luxembourg', 'Germany', 'The Netherlands', 'Spain', 'Italy', 'Greece',
      'Portugal', 'Austria', 'Denmark', 'Norway', 'Sweden', 'Finland', 'Ireland', 'Poland', 'Estonia',
      'Latvia', 'Lithuania', 'Slovak Republic', 'United Kingdom', 'Croatia', 'Serbia',
      'Bosnia and Herzegovina', 'Bulgaria', 'Czech Republic', 'Hungary', 'Slovenia', 'Switzerland'
    ];
    this.years4Single = renderYearsArray(20);
    this.years4All = renderYearsArray(5);
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
              { 'countryName': fetchArray[i], 'population': undefined, 'datatype' : 'all', 'year': this.state.year } :
              { 'year': fetchArray[i], 'population': undefined, 'datatype' : 'single' };
          }else{ // else return the data
            return (this.state.view === 'all') ?
              { 'countryName': fetchArray[i], 'population': value.total_population.population, 'datatype' : 'all', 'year': getYearFromDate(value.total_population.date) } :
              { 'year': fetchArray[i], 'population': value, 'datatype' : 'single' };
          }
        });
      this.setState({
        data: combinedData,
        // data was loaded
        isLoading: false
      });
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
      // don't allow values below the lowest possible year
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

  checkDataType(data){
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

    // do a new api fetch when
    // there was a change in the view
    // the view is all and the year changes
    // when the country changes
    if (
      this.state.view !== prevState.view ||
      ( this.state.view === prevState.view && this.state.view === 'all' && this.state.year !== prevState.year ) ||
      this.state.country !== prevState.country) {
      this.handleFetch();
    }
  }

  render(){

    //console.log(this.state.data);

    // if isLoading = true it means that there's a problem
    // the new data hasn't arrived yet but the new components are getting mounted
    // so the new comps get fed the wrong data => errors
    // we solve this by checking the data
    // if the datastructure doesn't correspond to the state.view we keep showing the old component while the data loads
    // also expect no data yet (first load)
    const dataType = this.checkDataType(this.state.data);

    return (

      <div>

        <Controls
          view={this.state.view}
          country={this.state.country}
          countries={this.countries}
          year={this.state.year}
          years4Single={this.years4Single}
          years4All={this.years4All}
          handleControles={this.handleControles} />

        {this.state.isLoading && <Loading />}

        <div className="container">

        <SelectCountry countries={this.countries} />

          <Switch>

            <Route exact
              path="/"
              render={props =>
                <AllCountries
                  handleCountrySelect={this.handleCountrySelect}
                  ref={this.countryOverviewRef}
                  year={this.state.year} />
            }/>

            <Route
              path="/:country"
              render={props =>
                <SingleCountries
                  data={this.state.data}
                  year={this.state.year}
                  //country={this.getCountryFromData(this.state.data)} />
                  country={this.state.country} />
            }/>


            {/*<Route exact path="/" render={props => <Test1 message="Heloo" />} />
            <Route path="/:country" component={Test2} />*/}
            {/*<Route exact
              path="/"
              render={props =>
                <AllCountries
                  data={this.state.data}
                  handleCountrySelect={this.handleCountrySelect}
                  ref={this.countryOverviewRef}
                  year={this.state.year} />}

            <Route
              path="/:country"
              render={props =>
                <SingleCountries
                  data={this.state.data}
                  year={this.state.year}
                  country={this.getCountryFromData(this.state.data)} />}*/}
          </Switch>

          {/*dataType === 'all' &&
            <AllCountries
              data={this.state.data}
              handleCountrySelect={this.handleCountrySelect}
              ref={this.countryOverviewRef}
              year={this.state.year} />}

          {dataType === 'single' &&
            <SingleCountries
              data={this.state.data}
              year={this.state.year}
              country={this.getCountryFromData(this.state.data)} />*/}

          <Footer />

        </div>

      </div>
    );
  };
};

export default ChartApp;
