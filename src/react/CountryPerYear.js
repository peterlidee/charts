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
          label: 'males',
          type:'bar',
          data: this.props.totalsPerYear.males,
          fill: false,
          backgroundColor: '#00ff00',
          hoverBackgroundColor: '#00ff00',
          borderWidth: 3,
          borderColor: '#00ff00',
          hoverBorderColor: '#00ff00'
        },
        {
          type: 'bar',
          label: 'females',
          data: this.props.totalsPerYear.females,
          fill: false,
          backgroundColor: '#ff0000',
          hoverBackgroundColor: '#ff0000',
          borderWidth: 0,
          borderWidth: 3,
          borderColor: '#ff0000',
          hoverBordercolor: '#ff0000'
        },
        {
          type: 'line',
          label: 'total population',
          data: this.props.totalsPerYear.total,
          fill: false,
          backgroundColor: '#0000dd',
          borderWidth: 3,
          borderColor: '#0000dd',
          hoverBackgroundColor: '#0000dd',
          hoverBorderColor: '#0000dd',
        }]
    };

    const options = {
      responsive: true,
      tooltips: {
        mode: 'index',
        intersect: false,
        position: 'average',
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
          scaleLabel: {
            display: true,
            labelString: 'population'
          },
          ticks: {
            autoskip: true,
            beginAtZero: true,
            // change the tick text
            callback: function(value, index, values) {
              return prettyfyPopulationNum(+value);
            }
          },
        }],
      }
    };

    return(
      <div className="sc__container--full">
        <h2>CountryPerYear</h2>
        <Bar data={data} options={options} />
      </div>
    );
  }
}
 export default CountryPerYear;
