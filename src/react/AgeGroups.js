import React from 'react';
import {Bar} from 'react-chartjs-2';
import {prettyfyPopulationNum} from '../helpers.js';

class AgeGroups extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    console.log(this.props.blob);
    const data = {
      datasets: [
        {
          label: 'Male',
          type:'bar',
          data: this.props.blob.males || [],
          fill: false,
          borderColor: '#00ff00',
          backgroundColor: '#00ff00',
          //pointBorderColor: '#00ffff',
          //pointBackgroundColor: '#EC932F',
          //pointHoverBackgroundColor: '#EC932F',
          //pointHoverBorderColor: '#EC932F',
          //xAxisID: 'x-axis-1'
        },
        {
          type: 'bar',
          label: 'Female',
          data: this.props.blob.females || [],
          fill: false,
          backgroundColor: '#ff0000',
          borderColor: '#ff0000',
          //pointBorderColor: '#ff0000',
          //hoverBackgroundColor: '#00ff00',
          //hoverBorderColor: '#00ff00',
          //xAxisID: 'x-axis-2'
        },
        {
          type: 'line',
          label: 'total population',
          data: this.props.blob.total || [],
          fill: false,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,0.4)',
          hoverBackgroundColor: '#71B37C',
          hoverBorderColor: '#71B37C',
          //xAxisID: 'x-axis-3'
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
            return 'Age group: ' + tooltipItem[0].xLabel;
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
          labels: this.props.blob.labels,
          scaleLabel: {
            display: true,
            labelString: 'age groups'
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
        <h2>AgeGroupTotals</h2>
        <Bar data={data} options={options} />
      </div>
    );
  }
}
export default AgeGroups;
