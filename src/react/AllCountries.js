import React from 'react';
import {prettyfyPopulationNum, doFetch, getYearFromDate} from '../js/helpers.js';
import {colors} from '../js/colors';
import {countries} from '../js/countries';
import Loading from "./Loading";
import {HorizontalBar} from 'react-chartjs-2';

class AllCountries extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      blob: [],
    }
    this.horizontalBarRef = React.createRef();
    this.countries = countries.sort((a, b) => a > b);
    this.handleFetch = this.handleFetch.bind(this);

  }


  handleFetch(){

    this.setState({ isLoading: true });

    // view all
    // all the countries -> the total population -> 2018
    // http://api.population.io/1.0/population/Belgium/2018-01-01/

    const fetch = doFetch(countries, `${this.props.year}-01-01`);

    Promise.all(fetch)
      .then( values => {
        const combinedData = values.map((value, i) => {
          if(!value){ // if there was no response, return undefined as data
            return { 'countryName': this.countries[i], 'population': undefined, 'year': this.state.year }
          }else{ // else return the data
            return { 'countryName': this.countries[i], 'population': value.total_population.population, 'year': getYearFromDate(value.total_population.date) };
          }
        });
      this.setState({
        blob: combinedData,
        isLoading: false,
      });
    })
    .catch(error => this.setState({ error: error, isLoading: false })); /* isn't used */
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

    // call the data and put it in state
    this.handleFetch();

  }

  componentDidUpdate(prevProps, prevState) {

    // do a new api fetch when the year props changes
    if ( this.props.year !== prevProps.year ){
      //console.log('fetching new year')
      this.handleFetch();
    }

  }

  render() {

    // sort the data from hightest to lowest population once the data loads
    const sortedData = this.state.blob[0] !== undefined ? this.state.blob.sort((a, b) => a.population < b.population) : this.state.blob;

    // data obj with settings to feed to HorizontalBar comp
    const data = {
      labels: sortedData.map(item => item.countryName),
      datasets: [
        {
          label: 'population',
          data: sortedData.map(item => item.population),
          backgroundColor: colors.total,
          hoverBackgroundColor: colors.total,
          borderWidth: 0,
        }
      ]
    };

    // options obj with settings to feed to HorizontalBar comp
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
            labelString: 'countries',
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

    return (
      <div className="chart__container">
        {this.state.isLoading && <Loading />}
        <h2 className="chart__title">European populations in {this.props.year}</h2>
        <HorizontalBar data={data} options={options} onElementsClick={this.props.handleCountrySelect} ref={this.horizontalBarRef} />
      </div>
    )
  }
}

export default AllCountries;
