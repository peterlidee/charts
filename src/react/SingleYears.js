import React from 'react';
import {Bar} from 'react-chartjs-2';
import {prettyfyPopulationNum} from '../js/helpers.js';
import {colors} from '../js/colors';

class SingleYears extends React.Component{
  constructor(props){
    super(props)
  }
  render(){

    const data = {
      datasets: [
        {
          label: 'males',
          type:'bar',
          //data: this.props.blob.males || [],
          data: this.props.blob.map(item => item.males),
          fill: false,
          backgroundColor: colors.males,
          hoverBackgroundColor: colors.males,
          borderWidth: 3,
          borderColor: colors.males,
          hoverBorderColor: colors.males
        },
        {
          type: 'bar',
          label: 'females',
          data: this.props.blob.map(item => item.females),
          fill: false,
          backgroundColor: colors.females,
          hoverBackgroundColor: colors.females,
          borderWidth: 3,
          borderColor: colors.females,
          hoverBorderColor: colors.females
        },
        {
          type: 'line',
          label: 'total population',
          data: this.props.blob.map(item => item.total),
          fill: false,
          backgroundColor: colors.total,
          borderWidth: 3,
          borderColor: colors.total,
          hoverBackgroundColor: colors.total,
          hoverBorderColor: colors.total,
        }]
    };

    const options = {
      tooltips: {
        callbacks: {
          // add year label to tooltip label
          title: function(tooltipItem, data){
            return 'year: ' + tooltipItem[0].xLabel;
          },
          // alter the labels to make numbers readable
          label: function(tooltipItem, data) {
            let label = data.datasets[tooltipItem.datasetIndex].label || [];
            if (label) { label += ': '; }
            label += prettyfyPopulationNum(tooltipItem.yLabel);
            return label;
          }
        }
      },
      scales: {
        xAxes: [{
          labels: this.props.blob.map(item => item.year),
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
      <div className="chart__container">
        <h2 className="chart__title">{this.props.country}: population per year</h2>
        <Bar data={data} options={options} />
      </div>
    );
  }
}
 export default SingleYears;
