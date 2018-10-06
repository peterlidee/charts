import ChartApp from "./react/ChartApp";
import style from "./sass/main.scss";

const countries = ['Belgium', 'France', 'Luxembourg', 'Germany', 'The Netherlands', 'Spain', 'Italy', 'Greece', 'Portugal', 'Austria', 'Denmark', 'Norway', 'Sweden', 'Finland', 'Ireland', 'Poland', 'Estonia', 'Czech Republic', 'Latvia', 'Lithuania', 'Slovak Republic', 'United Kingdom'];

let endpoint = "http://api.population.io/1.0/population/2018/Belgium/";

fetch(endpoint)
.then(response => {

  if (response.status !== 200) {
    console.log('Looks like there was a problem. Status Code: ' +
      response.status);
    return;
  }

  // Examine the text in the response
  response.json().then(function(data) {
    console.log(data);
    calculateTotalPopulation(data);
  });

}).catch(function(err) {
  console.log('Fetch Error :-S', err);
});

function calculateTotalPopulation(arr){
  const total = arr.reduce((acc, curr) => {
    return acc + curr.total;
  }, 0);
  console.log(total);
}
