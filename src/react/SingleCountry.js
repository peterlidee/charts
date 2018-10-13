import React from 'react';
import {Bar} from 'react-chartjs-2';
import {prettyfyPopulationNum} from '../helpers.js'

class SingleCountry extends React.Component{
  constructor(props){
    super(props)
  }
  render(){


    const countryData = this.props.data;
    //console.log(countryData)


    // gather relevant data arrays [1],[2]
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
    // -> the total relation man/women -> see totals above: done
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
    })
    console.log('ageGroupTotals', ageGroupTotals);



    const data = {

      datasets: [
        {
          label: 'Male',
          type:'line',
          data: totalsPerYear.males,
          fill: false,
          borderColor: '#00ff00',
          backgroundColor: '#00ff00',
          //pointBorderColor: '#00ffff',
          //pointBackgroundColor: '#EC932F',
          //pointHoverBackgroundColor: '#EC932F',
          //pointHoverBorderColor: '#EC932F',
          //yAxisID: 'y-axis-1'
        },
        {
          type: 'line',
          label: 'Female',
          data: totalsPerYear.females,
          fill: false,
          backgroundColor: '#ff0000',
          borderColor: '#ff0000',
          //pointBorderColor: '#ff0000',
          //hoverBackgroundColor: '#00ff00',
          //hoverBorderColor: '#00ff00',
          //yAxisID: 'y-axis-2'
        },
        {
          type: 'bar',
          label: 'total population',
          data: totalsPerYear.total,
          fill: false,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,0.4)',
          hoverBackgroundColor: '#71B37C',
          hoverBorderColor: '#71B37C',
          //yAxisID: 'y-axis-3'
        }]
    };

    const options = {
      responsive: true,
      tooltips: {
        mode: 'index',
        // make tooltip visible when hover anywhere
        intersect: false,
        position: 'nearest',
        callbacks: {
          // add year label to tooltip label
          title: function(tooltipItem, data){
            return 'Year: ' + tooltipItem[0].xLabel;
          },
          // alter the labels to make numbers readable
          label: function(tooltipItem, data) {
            let label = data.datasets[tooltipItem.datasetIndex].label || '';
            if (label) { label += ': '; }
            label += prettyfyPopulationNum(tooltipItem.yLabel);
            return label;
          }
        }
      },
      scales: {
        xAxes: [{
          labels: totalsPerYear.year,
          scaleLabel: {
            display: true,
            labelString: 'years'
          },
          gridLines: {
            display: false
          },
        }],
        yAxes: [{
          type: 'linear',
          //id: 'y-axis-1',
          scaleLabel: {
            display: true,
            labelString: 'population'
          },

          ticks: {
            beginAtZero: true,
            // change the tick text
            callback: function(value, index, values) {
              //console.log(value, index, values);
              return prettyfyPopulationNum(+value);
            }
          },
        }],
      }
    };


    return(
      <div>
        <h2>Mixed data Example</h2>
        <Bar
          data={data}
          options={options}
        />
      </div>
    );
  }
}

export default SingleCountry;
