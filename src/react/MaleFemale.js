import React from 'react';
import {Doughnut} from 'react-chartjs-2';
import {prettyfyPopulationNum} from '../helpers.js';

class CountryPerYear extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    //console.log(this.props.maleFemaleCurrYear);
    const maleFemaleData = this.props.maleFemaleCurrYear;
    const maleFemaleKeys = Object.keys(maleFemaleData);

    const data = {
    	labels: maleFemaleKeys,
    	datasets: [{
    		data: maleFemaleKeys.map(key => maleFemaleData[key]),
    		backgroundColor: [
        '#36A2EB',
        '#FF6384',

    		],
    		hoverBackgroundColor: [
    		'#36A2EB',
        '#FF6384',
    		]
    	}]
    };
    const options = {
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
    }

    return(
      <div>
        <h2>MaleFemale</h2>
        <Doughnut data={data} options={options} />
      </div>
    );
  }
}
 export default CountryPerYear;
