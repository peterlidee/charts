import React from 'react';
import {HorizontalBar} from 'react-chartjs-2';
import {prettyfyPopulationNum} from '../js/helpers.js';
import {colors} from '../js/colors';

class SingleAverages extends React.Component{
  constructor(props){
    super(props);
  }
  render(){

    const data = {
      labels: this.props.blob.labels || [],
      datasets: [
        {
          backgroundColor: [colors.total, colors.males, colors.females],
          hoverBackgroundColor: [colors.total, colors.males, colors.females],
          borderWidth: 0,
          data: this.props.blob.data || []
        }
      ]
    };

    const options = {
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'age'
          },
          ticks: {
            beginAtZero: true,
          },
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'population'
          },
          gridLines: {
            display: false,
          },
        }]
      },
      tooltips: {
        callbacks: {
          // alter the labels to make numbers readable
          label: function(tooltipItem, data) {
              return 'age: ' + tooltipItem.xLabel;
          }
        },
      },
      legend: {
        display: false
      },
    }

    return (
      <div className="chart__container chart__container--half">
        <h2 className="chart__title">{this.props.country}: average age in {this.props.year}</h2>
        <HorizontalBar data={data} options={options} />
      </div>
    );
  }
}

export default SingleAverages;
