import React from 'react';
import {Bar} from 'react-chartjs-2';
import {prettyfyPopulationNum} from '../helpers.js';

class CountryPerYear extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    //console.log(this.props.totalsPerYear)
    const data = {
      datasets: [
        {
          label: 'Male',
          type:'line',
          data: this.props.totalsPerYear.males,
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
          data: this.props.totalsPerYear.females,
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
          data: this.props.totalsPerYear.total,
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
          labels: this.props.totalsPerYear.year,
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
        <h2>CountryPerYear</h2>
        <Bar data={data} options={options} />
      </div>
    );
  }
}
 export default CountryPerYear;
