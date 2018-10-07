import ChartApp from "./react/ChartApp";
import style from "./sass/main.scss";

const countries = [
  'Belgium', 'France', 'Luxembourg', 'Germany', 'The Netherlands', 'Spain', 'Italy', 'Greece',
  'Portugal', 'Austria', 'Denmark', 'Norway', 'Sweden', 'Finland', 'Ireland', 'Poland', 'Estonia',
  'Czech Republic', 'Latvia', 'Lithuania', 'Slovak Republic', 'United Kingdom', 'Croatia', 'Serbia',
  'Bosnia and Herzegovina', 'Bulgaria', 'Czech Republic', 'Hungary', 'Slovenia', 'Switzerland'];

console.log(countries);

let endpoint = "http://api.population.io/1.0/population/2018/Belgium/";

fetch(endpoint)
  .then(response => {

    if (response.status !== 200) {
      console.log('Looks like there was a problem. Status Code: ' +
        response.status);
      return;
    }

    // Examine the text in the response
    response.json().then((data) => {
      console.log(data);
      calculateTotalPopulation(data);
    });

  }).catch(function(err) {
    console.log('Fetch Error :-S', err);
});

function getCountryData(country, year){
  const endpoint = `http://api.population.io/1.0/population/${year}/${country}/`;
  //const result = [];
  fetch(endpoint)
    .then(response => {
      if (response.status !== 200) {
        return [];
      }
      response.json().then((data) => {
        return data;
      });
    }).catch(function(err) {
      //console.log('Fetch Error :-S', err);
      return [];
  });
}

function calculateTotalPopulation(arr){
  const total = arr.reduce((acc, curr) => {
    return acc + curr.total;
  }, 0);
  console.log(total);
}
