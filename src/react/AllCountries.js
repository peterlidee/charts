import React from 'react';
import {HorizontalBar} from 'react-chartjs-2';
import {prettyfyPopulationNum} from '../helpers.js';
import {colors} from '../colors';

class AllCountries extends React.Component {
  constructor(props){
    super(props);
    //this.test = this.test.bind(this);
    this.horizontalBarRef = React.createRef();
  }

  componentDidMount() {

    // chart.js does not have an onClick handler for ticks, so we write it here
    // this handles clicks on ticks, see also options .onclick for clicks on bars
  	Chart.pluginService.register({
      afterEvent: function handleTickClick(chartInstance, chartEvent) {

        if( chartEvent.type === 'click'){
          // reset the property tickLabel on chartInstance with false
          chartInstance.labelTick = false;

          const yAxis = chartInstance.chart.chart.scales['y-axis-0'];
          const x = chartEvent.x;
          const y = chartEvent.y;
          // only accept clicks in the area of the ticks (horizontal or vertical axis)
          if ( x < yAxis.right && x > yAxis.left && y < yAxis.bottom && y > yAxis.top) {
            var index = yAxis.getValueForPixel(y);
            // set a property on chartInstance with the value of the tick clicked
            chartInstance.labelTick = chartInstance.data.labels[index];
          }
        }
      }
  	});

  }

  render() {

    const rawData = this.props.data.map(item => {
      if(item.population === undefined){
        return { population: 0, countryName: item.countryName }
      }else{
        return item;
      }
    }).sort((a, b) => a.population < b.population);
    //console.log(rawData);

    const data = {
      labels: rawData.map(item => item.countryName),
      datasets: [
        {
          label: 'population',
          data: rawData.map(item => item.population),
          backgroundColor: colors.total,
          hoverBackgroundColor: colors.total,
          borderWidth: 0,
        }
      ]
    };

    const options = {
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'population'
          },
          ticks: {
            callback: function(value, index, values) {
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
        callbacks: {
          // alter the labels to make numbers readable
          label: function(tooltipItem, data) {
              let label = data.datasets[tooltipItem.datasetIndex].label || '';
              if (label) { label += ': '; }
              label += prettyfyPopulationNum(tooltipItem.xLabel);
              return label;
          }
        }
      },
      onClick: function(e, arr) {
        // this handles clicks on bars, see also componentDidMount
        if(arr.length > 0){
          this.labelBar = arr[0]._view.label;
        }else{
          this.labelBar = false;
        }
      },
    }

    //get the year from data, not from state!!
    const currYear = rawData[0].year;

    return (
      <div className="chart__container">
        <h2 className="chart__title">European populations in {currYear}</h2>
        <HorizontalBar data={data} options={options} onElementsClick={this.props.handleCountrySelect} ref={this.horizontalBarRef} />
      </div>
    )
  }
}

export default AllCountries;
