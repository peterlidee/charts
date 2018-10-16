import React from 'react';
import {HorizontalBar} from 'react-chartjs-2';
import {prettyfyPopulationNum} from '../helpers.js';
import {colors} from '../colors';

class SingleAverages extends React.Component{
  constructor(props){
    super(props);
  }
  render(){

    const blob = this.props.blob;
    let labelsArr = [];
    let dataArr = [];
    blob.map(item => {
      if(item !== undefined){
        labelsArr = [...Object.keys(item)];
        dataArr = labelsArr.map(key => item[key]);
      }
    });
    //console.log('labels', labelsArr, dataArr);

    const data = {
      labels: labelsArr,
      datasets: [
        {
          label: 'Population',
          fill: false,
          backgroundColor: [colors.total, colors.males, colors.females],
          hoverBackgroundColor: [colors.total, colors.males, colors.females],
          borderWidth: 0,
          data: dataArr
        }
      ]
    };

    const options = {
      responsive: true,
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
        // make tooltip visible when hover anywhere
        intersect: false,
        callbacks: {
          // alter the labels to make numbers readable
          label: function(tooltipItem, data) {
              return 'age: ' + tooltipItem.xLabel;
          }
        },
        xPadding: 8,
        yPadding: 8
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
