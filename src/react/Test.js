import React from 'react';
import {HorizontalBar} from 'react-chartjs-2';
import {prettyfyPopulationNum} from '../helpers.js'

import { defaults } from 'react-chartjs-2';
import { Chart } from 'react-chartjs-2';

// Disable animating charts by default.
//defaults.global.animation = false;

console.log(defaults);






/*defaults.global.plugin.register.onClick = function(e) {
  console.log(e);
  //update_caption(legendItem);
  //original.call(this, e, legendItem);
};*/

/*defaults.scale.ticks.callback = {

}*/

//defaults.scale.ticks.display = false;

/*defaults.global.plugin.register({
  onEvent: function(chartInstance, chartEvent) {
    var xAxis = chartInstance.scales['x-axis-0'];

    // If mouse is over the legend, change cursor style to pointer, else don't show it
    var x = chartEvent.x;
    var y = chartEvent.y;

    if (chartEvent.type === 'click' &&
    	x <= xAxis.right && x >= xAxis.left &&
      y <= xAxis.bottom && y >= xAxis.top) {
      // category scale returns index here for some reason
      var index = xAxis.getValueForPixel(x);
      //document.getElementById('tick').innerHTML = chartInstance.data.labels[index];
      console.log('click value?', chartInstance.data.labels[index]);
    }
  }
});*/

/*Chart.plugins.register({
  onEvent: function(chartInstance, chartEvent) {
    var xAxis = chartInstance.scales['x-axis-0'];

    // If mouse is over the legend, change cursor style to pointer, else don't show it
    var x = chartEvent.x;
    var y = chartEvent.y;

    if (chartEvent.type === 'click' &&
    	x <= xAxis.right && x >= xAxis.left &&
      y <= xAxis.bottom && y >= xAxis.top) {
      // category scale returns index here for some reason
      var index = xAxis.getValueForPixel(x);
      document.getElementById('tick').innerHTML = chartInstance.data.labels[index];
    }
  }
});*/


class Test extends React.Component {
  constructor(props){
    super(props);
  }
  test(tick){
    console.log(handleTickClick());
    //console.log('click', params[0], params[1])
    //console.log(chart)
  }

  componentWillMount() {

    //console.log(Chart.pluginService);
    // chart.js does not have an onClick handler for ticks, so we write it here
  	Chart.pluginService.register({
      afterEvent: function handleTickClick(chartInstance, chartEvent) {
        if( chartEvent.type === 'click'){
          const yAxis = chartInstance.chart.chart.scales['y-axis-0'];
          const x = chartEvent.x;
          const y = chartEvent.y;
          // only accept clicks in the area of the ticks (horizontal or vertical axis)
          if ( x < yAxis.right && x > yAxis.left && y < yAxis.bottom && y > yAxis.top) {
            // category scale returns index here for some reason
            var index = yAxis.getValueForPixel(y);
            //document.getElementById('tick').innerHTML = chartInstance.data.labels[index];
            console.log('klik', chartInstance.data.labels[index]);
            //this.test(chartInstance.data.labels[index]);
            return chartInstance.data.labels[index];
          }
        }
      }
  	});
  }

  render() {
    //console.log(this.props.data);
    const rawData = this.props.data.sort((a, b) => a.population < b.population);
    console.log(rawData);
    const data = {
      labels: rawData.map(item => item.countryName),
      datasets: [
        {
          label: 'Population',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
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
          data: rawData.map(item => item.population)
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
            labelString: 'population'
          },
          ticks: {
            //minRotation: 90,
            //display: false,
            //autoskip: false,
            //padding: 50
            // change the tick text
            callback: function(value, index, values) {
              //console.log(value, index, values);
              return prettyfyPopulationNum(+value);
            }
          },
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'countries'
          },
        }]
      },
      tooltips: {
        // make tooltip visible when hover anywhere
        intersect: false,
        callbacks: {
          // alter the labels to make numbers readable
          label: function(tooltipItem, data) {
            //console.log(tooltipItem, data);

              let label = data.datasets[tooltipItem.datasetIndex].label || '';
              if (label) { label += ': '; }
              label += prettyfyPopulationNum(tooltipItem.xLabel);
              return label;
          }
        }
      },
      legend: {
        display: true
      },
      onClick: function(e, arr) {
        //console.log(e.target, arr); //arr[0]._view.label
      },
      //{
      	//onElementsClick: (elems) => { console.log(elems) },
      	//getElementsAtEvent: (elems) => { console.log(elems) },
      	// `elems` is an array of chartElements
      //}

    }
    return (
      <div>
        <h2>Line Example</h2>
        <HorizontalBar data={data} options={options} />
      </div>
    )
  }
}

export default Test;
