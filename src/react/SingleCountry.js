import React from "react";
import CountryPerYear from "./CountryPerYear";
import MaleFemale from "./MaleFemale";
import AgeGroups from "./AgeGroups";
import Averages from "./Averages";
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
    const dataCurrYear = countryData.filter(item => item.year === this.props.year);
    //console.log('dataCurrYear', dataCurrYear);

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










    //console.log('ageGroupTotals', ageGroupTotals);

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
    //console.log('maleFemaleCurrYear', maleFemaleCurrYear);



    // [3] average and mean per year for total, male, female
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
    //console.log('averageCurrYear', averagesCurrYear)

    return(
      <div className="singleCountry">

        <header className="sc__container--full">
          <h2>Single Country</h2>
        </header>

        <CountryPerYear blob={totalsPerYear} country={this.props.country} />
        <AgeGroups blob={ageGroupsData} country={this.props.country} year={this.props.year} />
        <div className="sc__container">
          <MaleFemale maleFemaleCurrYear={maleFemaleCurrYear} country={this.props.country} year={this.props.year} />
          <Averages blob={averagesCurrYear} country={this.props.country} year={this.props.year} />
        </div>
      </div>
    );
  }
}

export default SingleCountry;
