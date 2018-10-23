import React from "react";
import SingleYears from "./SingleYears";
import SingleAgeGroups from "./SingleAgeGroups";
import SingleMaleFemale from "./SingleMaleFemale";
import SingleAverages from "./SingleAverages";
import {Bar} from "react-chartjs-2";
import {prettyfyPopulationNum, doFetch} from "../js/helpers.js";

class SingleCountries extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      blob: [],
    }
    this.handleFetch = this.handleFetch.bind(this);
  }

  handleFetch(){

    // view all
    // all the countries -> the total population -> 2018
    // http://api.population.io/1.0/population/Belgium/2018-01-01/

    const fetch = doFetch(countries, `${this.props.year}-01-01`);

    Promise.all(fetch)
      .then( values => {
        const combinedData = values.map((value, i) => {
          if(!value){ // if there was no response, return undefined as data
            return { 'countryName': this.countries[i], 'population': undefined, 'year': this.state.year }
          }else{ // else return the data
            return { 'countryName': this.countries[i], 'population': value.total_population.population, 'year': getYearFromDate(value.total_population.date) };
          }
        });
      this.setState({
        blob: combinedData,
        isLoading: false
      });
    })
    .catch(error => this.setState({ error: error, isLoading: false })); /* isn't used */
  }

  handleFetch(){

    // view single
    // one country -> 20 years
    // http://api.population.io/1.0/population/2018/Belgium/

    const fetch = this.doFetch(this.years4Single, this.props.country);

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






  render(){

    const countryData = this.props.data;
    //console.log('countryData', countryData)

    // gather relevant data arrays [1],[2],[3],[4]

    // [1] get total pop in curr country for every year
    let totalsPerYear = {
      year : [],
      total: [],
      males: [],
      females: []
    };
    const countryPerYear = countryData.map(item => {
      // handle no data
      if(item.population === undefined){
        return { year: item.year, total: 0, males: 0, females: 0 };
      }
      // reduce to single data point
      const totals = item.population.reduce((acc, curr) => {
        acc.total += curr.total;
        acc.males += curr.males;
        acc.females += curr.females;
        return acc;
      }, {total: 0, males: 0, females: 0});
      totals.year = item.year;
      return totals;
    });
    //console.log(countryPerYear);

    // convert to arrays
    countryPerYear.map(year => {
      Object.keys(year).map((key, i) => {
        totalsPerYear[key].push(year[key]);
      });
    });
    //console.log('totalsPerYear', totalsPerYear);


    // [2] get for one given year,
    // -> the population per age group
    let ageGroupsData = {
      //labels : ['-18', '18-44', '45-65', '65+'],
      labels : ['-10','10s','20s','30s','40s','50s','60s','70s','80s','90s'],
      total: [],
      males: [],
      females: []
    };

    //const ageGroupRanges = [[0,17], [18,44], [45,65], [66,150]];
    const ageGroupRanges = [[0,9], [10, 19], [20,29], [30,39], [40,49], [50,59], [60,69], [70,79], [80,89], [90,150]];
    //const ageGroupLabels = ['-18', '18-44', '45-65', '65+'];

    // reduce the data to the totals of these ageGroups
    // per agegroup -> {total: x, males: x, females: x}

    // get current year
    const dataCurrYear = countryData.filter(item => +item.year === +this.props.year);

    // filter per agegroup
    const agesPerAgeGroup = ageGroupRanges.map(ageGroupRange => {
      if(dataCurrYear.length > 0){
        return dataCurrYear[0].population
          .filter(item => item.age >= ageGroupRange[0] && item.age <= ageGroupRange[1])
      }
    });
    //console.log('agesPerAgeGroup', agesPerAgeGroup);

    const ageGroupTotals = agesPerAgeGroup.map(item => {
      if(item !== undefined){
        return item.reduce((acc, curr) => {
          acc.total += curr.total;
          acc.males += curr.males;
          acc.females += curr.females;
          return acc;
        }, { total: 0, males: 0, females: 0 })
      }
    });

    // convert to arrays
    ageGroupTotals.map((item, i) => {
      if(item !== undefined){
        Object.keys(item).map(key =>{
          ageGroupsData[key].push(item[key]);
        });
      }
    });
    //console.log(ageGroupsData);



    // [3] male/female numbers curr year
    const maleFemaleCurrYear = ageGroupTotals.reduce((acc, curr) => {
      if(curr !== undefined){
        acc.males += curr.males;
        acc.females += curr.females;
        return acc;
      }
    }, { males: 0, females: 0 }) || [];
    //console.log('maleFemaleCurrYear', maleFemaleCurrYear);



    // [4] average and mean per year for total, male, female
    const averagesCurrYear = dataCurrYear.map(item => {
      if(item !== undefined){
        //console.log(item);
        const total = item.population.reduce((acc, curr) => {
          acc.sumTotal += (curr.total * curr.age);
          acc.allTotal += curr.total;
          acc.sumMales += (curr.males * curr.age);
          acc.allMales += curr.males;
          acc.sumFemales += (curr.females * curr.age);
          acc.allFemales += curr.females;
          return acc;
        }, { sumTotal: 0, allTotal: 0, sumMales: 0, allMales: 0, sumFemales: 0, allFemales: 0 });
        //console.log(total);
        const averages = {
          total: Math.round(total.sumTotal / total.allTotal),
          males: Math.round(total.sumMales / total.allMales),
          females: Math.round(total.sumFemales / total.allFemales),
        }
        return averages;
      }
    });
    //console.log('averageCurrYear', averagesCurrYear);

    // convert to arrays
    let singleAveragesData = {};

    averagesCurrYear.map(item => {
      if(item !== undefined){
        const keys = [...Object.keys(item)];
        singleAveragesData.labels = keys;
        singleAveragesData.data = keys.map(key => item[key]);
      }
    });
    //console.log('singleAveragesData', singleAveragesData);

    return(
      <div className="singleCountry">

        <SingleYears blob={totalsPerYear} country={this.props.country} />
        <SingleAgeGroups blob={ageGroupsData} country={this.props.country} year={this.props.year} />
        <div className="half-charts__container">
          <SingleMaleFemale blob={maleFemaleCurrYear} country={this.props.country} year={this.props.year} />
          <SingleAverages blob={singleAveragesData} country={this.props.country} year={this.props.year} />
        </div>
      </div>
    );
  }
}

export default SingleCountries;
