import React from 'react';
import {Bar} from 'react-chartjs-2';
import {prettyfyPopulationNum} from '../js/helpers.js';
import {colors} from '../js/colors';

class SingleAgeGroups extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    //console.log('blob', this.props.blob);
    const data = {
      datasets: [
        {
          label: 'males',
          type:'bar',
          data: this.props.blob.map(item => item !== undefined ? item.males : 0),
          backgroundColor: colors.males,
          hoverBackgroundColor: colors.males,
          borderWidth: 3,
          borderColor: colors.males,
          hoverBorderColor: colors.males
        },
        {
          type: 'bar',
          label: 'females',
          data: this.props.blob.map(item => item !== undefined ? item.females : 0),
          backgroundColor: colors.females,
          hoverBackgroundColor: colors.females,
          borderWidth: 3,
          borderColor: colors.females,
          hoverBorderColor: colors.females
        },
        {
          type: 'line',
          label: 'total population',
          data: this.props.blob.map(item => item !== undefined ? item.total : 0),
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
          labels: ['-10','10s','20s','30s','40s','50s','60s','70s','80s','90s'],
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
export default SingleAgeGroups;
