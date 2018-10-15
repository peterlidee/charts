import React from 'react';
import {Bar} from 'react-chartjs-2';
import {prettyfyPopulationNum} from '../helpers.js';
import {colors} from '../colors';

class AgeGroups extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    //console.log(this.props.blob);
    const data = {
      datasets: [
        {
          label: 'males',
          type:'bar',
          data: this.props.blob.males || [],
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
          data: this.props.blob.females || [],
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
          data: this.props.blob.total  || [],
          fill: false,
          backgroundColor: colors.total,
          borderWidth: 3,
          borderColor: colors.total,
          hoverBackgroundColor: colors.total,
          hoverBorderColor: colors.total,
        }]
    };

    const options = {
      responsive: true,
      tooltips: {
        mode: 'index',
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
              return prettyfyPopulationNum(+value);
            }
          },
        }],
      }
    };

    return(
      <div className="chart__container">
        <h2 className="chart__title">{this.props.country}: age groups in {this.props.year}</h2>
        <Bar data={data} options={options} />
      </div>
    );
  }
}
export default AgeGroups;
