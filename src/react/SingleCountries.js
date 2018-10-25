import React from "react";
import SingleYears from "./SingleYears";
import SingleAgeGroups from "./SingleAgeGroups";
import SingleMaleFemale from "./SingleMaleFemale";
import SingleAverages from "./SingleAverages";
import {Bar} from "react-chartjs-2";
import { prettyfyPopulationNum, doFetch, renderYearsArray } from "../js/helpers.js";

class SingleCountries extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      blob: [],
    }
    this.handleFetch = this.handleFetch.bind(this);
    this.years = renderYearsArray(20);
  }

  handleFetch(){

    // view single
    // one country -> 20 years
    // http://api.population.io/1.0/population/2018/Belgium/

    const fetch = doFetch(this.years, this.props.match.params.country);

    Promise.all(fetch)
      .then( values => {
        const combinedData = values.map((value, i) => {
          if(!value){ // if there was no response, return undefined as data
            //return { 'year': this.props.years[i], 'population': undefined };
            return undefined;
          }else{ // else return the data
            //return { 'year': this.props.years[i], 'population': value };
            return value;
          }
        });
      this.setState({
        blob: combinedData,
        isLoading: false
      });
    })
    .catch(error => this.setState({ error: error, isLoading: false }));

  }


  componentDidMount() {

    //console.log('comp singleCountries did mount')
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

    //console.log(years);
    //console.log('countryData', rawData);

    // gather relevant data arrays [1],[2],[3],[4]

    // [1] get total pop in curr country for every year
    /*let totalsPerYear = {
      year : [],
      total: [],
      males: [],
      females: []
    };*/

    const countryPerYear = rawData.map(item => {
      // item.reduce
      // console.log(item);
      // handle no data
      /*if(item.population === undefined){
        return { year: item.year, total: 0, males: 0, females: 0 };
      }*/
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


    // convert to arrays
    /*countryPerYear.map(year => {
      Object.keys(year).map((key, i) => {
        totalsPerYear[key].push(year[key]);
      });
    });
    console.log('totalsPerYear', totalsPerYear);*/

    //console.log('hello')


    // get current year
    const dataCurrYear = rawData.filter( item => item[0].year === +this.props.year );

    // [2] get for one given year,
    // -> the population per age group
    /*let ageGroupsData = {
      //labels : ['-18', '18-44', '45-65', '65+'],
      labels : ['-10','10s','20s','30s','40s','50s','60s','70s','80s','90s'],
      total: [],
      males: [],
      females: []
    };*/

    //const ageGroupRanges = [[0,17], [18,44], [45,65], [66,150]];
    const ageGroupRanges = [[0,9], [10, 19], [20,29], [30,39], [40,49], [50,59], [60,69], [70,79], [80,89], [90,150]];
    //const ageGroupLabels = ['-18', '18-44', '45-65', '65+'];

    // reduce the data to the totals of these ageGroups
    // per agegroup -> {total: x, males: x, females: x}


    //console.log('dataCurrYear', dataCurrYear);

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

    /*const ageGroupTotals = agesPerAgeGroup.map(item => {
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
    */


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
      //console.log(item);
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
        //console.log(total);
        const averages = {
          total: Math.round(total.sumTotal / total.allTotal),
          males: Math.round(total.sumMales / total.allMales),
          females: Math.round(total.sumFemales / total.allFemales),
        }
        return averages;
      }
    });
    //console.log('averageCurrYear', averagesCurrYear[0]);

    // convert to arrays
    /*let singleAveragesData = {};

    averagesCurrYear.map(item => {
      if(item !== undefined){
        const keys = [...Object.keys(item)];
        singleAveragesData.labels = keys;
        singleAveragesData.data = keys.map(key => item[key]);
      }
    });*/
    //console.log('singleAveragesData', singleAveragesData);

    return(
      <div className="singleCountry">
        <SingleYears blob={countryPerYear} country={this.props.match.params.country} />
        <SingleAgeGroups blob={agesPerAgeGroup} country={this.props.match.params.country} year={this.props.year} />
        <div className="half-charts__container">
          <SingleMaleFemale blob={maleFemaleCurrYear} country={this.props.match.params.country} year={this.props.year} />
          <SingleAverages blob={averagesCurrYear[0]} country={this.props.match.params.country} year={this.props.year} />
        </div>
      </div>
    );
  }
}

export default SingleCountries;
