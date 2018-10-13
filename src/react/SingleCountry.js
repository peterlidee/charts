import React from "react";
import CountryPerYear from "./CountryPerYear";
import MaleFemale from "./MaleFemale";
import {Bar} from "react-chartjs-2";
import {prettyfyPopulationNum} from "../helpers.js";

class SingleCountry extends React.Component{
  constructor(props){
    super(props)
  }
  render(){

    const countryData = this.props.data;
    //console.log(countryData)

    // gather relevant data arrays [1],[2], [3]
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
    const ageGroups = [[0,17], [18,44], [45,65], [66,150]];
    const ageGroupLabels = ['-18', '18-44', '45-65', '65+'];

    // reduce the data to the totals of these ageGroups
    // per agegroup -> {total: x, males: x, females: x}

    // get current year
    const dataCurrYear = countryData.filter(item => item.year === this.props.year);
    // filter per agegroup
    const agesPerAgeGroup = ageGroups.map(ageGroup => {
      if(dataCurrYear.length > 0){
        return dataCurrYear[0].population
          .filter(item => item.age >= ageGroup[0] && item.age <= ageGroup[1])
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
    console.log('ageGroupTotals', ageGroupTotals);

    // [3] male/female numbers curr year
    /*const maleFemaleCurrYear = ageGroupTotals.reduce((acc, curr) => {
      acc.males += curr.males;
      acc.females += curr.females;
      return acc;
    }, { males: 0, females: 0 });*/
    const maleFemaleCurrYear = ageGroupTotals.reduce((acc, curr) => {
      if(curr !== undefined){
        acc.males += curr.males;
        acc.females += curr.females;
        return acc;
      }
    }, { males: 0, females: 0 }) || [];
    console.log('maleFemaleCurrYear', maleFemaleCurrYear);


    return(
      <div>
        <h2>Mixed data Example</h2>
        {/*<Bar
          data={data}
          options={options}
        />*/}
        <MaleFemale maleFemaleCurrYear={maleFemaleCurrYear} />
        <CountryPerYear totalsPerYear={totalsPerYear} />
      </div>
    );
  }
}

export default SingleCountry;
