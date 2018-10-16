import React from 'react';
import {Doughnut} from 'react-chartjs-2';
import {prettyfyPopulationNum} from '../helpers.js';
import {colors} from '../colors';

class CountryPerYear extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    //console.log(this.props.maleFemaleCurrYear);
    const maleFemaleData = this.props.blob;
    const maleFemaleKeys = Object.keys(maleFemaleData);

    const data = {
    	labels: maleFemaleKeys,
    	datasets: [{
    		data: maleFemaleKeys.map(key => maleFemaleData[key]),
    		backgroundColor: [colors.males, colors.females],
    		hoverBackgroundColor: [colors.males, colors.females],
        borderWidth: 3,
        borderColor: '#fff',
        hoverBorderColor: '#fff',
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
          // alter the labels to make numbers readable
          label: function(tooltipItem, data) {
            let label = data.labels[tooltipItem.index] || '';
            if (label) { label += ': '; }
            label += prettyfyPopulationNum(data.datasets[0].data[tooltipItem.index]);
            return label;
          }
        }
      },
      legend: {
        reverse: true
      }
    }

    return(
      <div className="chart__container chart__container--half">
        <h2 className="chart__title">{this.props.country}: male / female in {this.props.year}</h2>
        <Doughnut data={data} options={options} />
      </div>
    );
  }
}
 export default CountryPerYear;
