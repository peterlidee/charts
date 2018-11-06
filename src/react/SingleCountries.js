import React from "react";
import SingleYears from "./SingleYears";
import SingleAgeGroups from "./SingleAgeGroups";
import SingleMaleFemale from "./SingleMaleFemale";
import SingleAverages from "./SingleAverages";

import Loading from "./Loading";
import {Bar} from "react-chartjs-2";
import { prettyfyPopulationNum, doFetch, renderYearsArray } from "../js/helpers.js";
import { countries } from '../js/countries'

class SingleCountries extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      blob: [],
      isLoading: true,
    }
    this.handleFetch = this.handleFetch.bind(this);
    this.years = renderYearsArray(20).reverse();
  }

  handleFetch(){

    this.setState({ isLoading: true });

    // view single
    // one country -> 20 years
    // http://api.population.io/1.0/population/2018/Belgium/

    // check if the country is in the array of countries
    // this should catch 'wild' parameters too, fe /blabla
    // if not -> message no data available for this country in the app

    if(!countries.includes(this.props.match.params.country)){
      // the country is not in the countries list!!
      // redirect to elsewhere
      this.props.history.push('/notfound');
    }else{
      // but we also want to catch extra folders of slashes like /Greece/ or /Greece/blablabla
      // check if there is an extra slash or extra info
      if('/' + this.props.match.params.country !== this.props.location.path){
        // they don't match, redirect to the correct url
        this.props.history.push('/' + this.props.match.params.country);
      } // else: just do the rest of the code, country is correct and path is correct
    }

    const fetch = doFetch(this.years, this.props.match.params.country);

    Promise.all(fetch)
      .then( values => {
        const combinedData = values.map( value => value );
        if(!combinedData.includes(false)){
          this.setState({ blob: combinedData, isLoading: false });
        }else{
          this.props.history.push('/notfound');
        }
      })
      .catch( error => {
        //console.log('catch', error)
        // don't know when this could be used ...
        this.props.history.push('/notfound');
      });
  }

  componentDidMount() {
    // call the data and put it in state
    this.handleFetch();
  }

  componentDidUpdate(prevProps, prevState) {
    // only update when the country change, don't when year changes cause data is already there
    if(this.props.match.params.country !== prevProps.match.params.country){
      this.handleFetch();
    }
  }

  render(){

    const rawData = [...this.state.blob];

    // gather relevant data arrays [1],[2],[3],[4]

    // [1] get total pop in curr country for every year
    const countryPerYear = rawData.map(item => {
      // reduce to single data point
      const totals = item.reduce((acc, curr) => {
        acc.total += curr.total;
        acc.males += curr.males;
        acc.females += curr.females;
        return acc;
      }, {total: 0, males: 0, females: 0});
      totals.year = item[0].year;
      return totals;
    });
    //console.log('countryPerYear', countryPerYear);

    // get current year
    const dataCurrYear = rawData.filter( item => item[0].year === +this.props.year );

    // [2] get for one given year -> the population per age group

    // these are the ranges we use
    const ageGroupRanges = [[0,9], [10, 19], [20,29], [30,39], [40,49], [50,59], [60,69], [70,79], [80,89], [90,150]];

    // filter per agegroup
    const agesPerAgeGroup = ageGroupRanges.map(ageGroupRange => {
      if(dataCurrYear.length > 0){
        return dataCurrYear[0]
          // group them per age group
          .filter(item => item.age >= ageGroupRange[0] && item.age <= ageGroupRange[1])
          // reduce them to a single number
          .reduce((acc, curr) => {
            acc.total += curr.total;
            acc.males += curr.males;
            acc.females += curr.females;
            return acc;
          }, { total: 0, males: 0, females: 0 })
      }
    });
    //console.log('agesPerAgeGroup', agesPerAgeGroup);


    // [3] male/female numbers curr year
    const maleFemaleCurrYear = agesPerAgeGroup.reduce((acc, curr) => {
      if(curr !== undefined){
        acc.males += curr.males;
        acc.females += curr.females;
        return acc;
      }
    }, { males: 0, females: 0 });
    //console.log('maleFemaleCurrYear', maleFemaleCurrYear);


    // [4] average and mean per year for total, male, female
    const averagesCurrYear = dataCurrYear.map(item => {
      if(item !== undefined){
        const total = item.reduce((acc, curr) => {
          acc.sumTotal += (curr.total * curr.age);
          acc.allTotal += curr.total;
          acc.sumMales += (curr.males * curr.age);
          acc.allMales += curr.males;
          acc.sumFemales += (curr.females * curr.age);
          acc.allFemales += curr.females;
          return acc;
        }, { sumTotal: 0, allTotal: 0, sumMales: 0, allMales: 0, sumFemales: 0, allFemales: 0 });
        const averages = {
          total: Math.round(total.sumTotal / total.allTotal),
          males: Math.round(total.sumMales / total.allMales),
          females: Math.round(total.sumFemales / total.allFemales),
        }
        return averages;
      }
    });

    return(
      <>
        {this.state.isLoading && <Loading />}
        <SingleYears blob={countryPerYear} country={this.props.match.params.country} />
        <SingleAgeGroups blob={agesPerAgeGroup} country={this.props.match.params.country} year={this.props.year} />
        <div className="half-charts__container">
          <SingleMaleFemale blob={maleFemaleCurrYear} country={this.props.match.params.country} year={this.props.year} />
          <SingleAverages blob={averagesCurrYear[0]} country={this.props.match.params.country} year={this.props.year} />
        </div>
      </>
    );
  }
}

export default SingleCountries;
