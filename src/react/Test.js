import React from 'react';
import {HorizontalBar} from 'react-chartjs-2';

class Test extends React.Component {
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

    // format number from 10000 to '10.000'
    const prettyfyPopulationNum = (num) => {
      let myArray = num.toString().split('').reverse();
      let counter = 0;
      let newArray = [];
      for(let i = 0; i < myArray.length; i++){
        if(counter === 3){
          newArray.push('.');
          counter = 1;
        }else{
          counter++;
        }
        newArray.push(myArray[i]);
      }
      return newArray.reverse().join('');
    }

    const options = {
      /*title: {
        display: 'true',
        text: 'just a test'
      },*/
      scales: {
        xAxes: [{
          ticks: {
            //minRotation: 90,
            //display: false,
            //autoskip: false,
            //padding: 50
          }
        }]
      },
      tooltips: {
        // make tooltip visible when hover anywhere
        intersect: false,
        callbacks: {
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
        display: false
      }

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