import React from 'react';
import {HorizontalBar} from 'react-chartjs-2';
import {prettyfyPopulationNum} from '../helpers.js';
import {colors} from '../colors';

class Averages extends React.Component{
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
    console.log('labels', labelsArr, dataArr);

    const data = {
      labels: labelsArr,
      datasets: [
        {
          label: 'Population',
          fill: false,
          lineTension: 0.1,
          //backgroundColor: 'rgba(75,192,192,0.4)',
          backgroundColor: ['#ff0000', '#00dd00', '#0000dd'],
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: dataArr
        }
      ]
    };

    const options = {
      /*title: {
        display: 'true',
        text: 'just a test'
      },*/
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'age'
          },
          ticks: {
            beginAtZero: true,
            //suggestedMax: dataArr.sort((a, b) => a < b)[0] + 10,
            //suggestedMin: dataArr.sort((a, b) => a > b)[0] - 10,
            //minRotation: 90,
            //display: false,
            //autoskip: false,
            //padding: 50
            // change the tick text
            /*callback: function(value, index, values) {
              //console.log(value, index, values);
              return prettyfyPopulationNum(+value);
            }*/
          },
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'population'
          },
        }]
      },
      tooltips: {
        // make tooltip visible when hover anywhere
        intersect: false,
        /*callbacks: {
          // alter the labels to make numbers readable
          label: function(tooltipItem, data) {
            //console.log(tooltipItem, data);

              let label = data.datasets[tooltipItem.datasetIndex].label || '';
              if (label) { label += ': '; }
              label += prettyfyPopulationNum(tooltipItem.xLabel);
              return label;
          }
        }*/
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

export default Averages;
