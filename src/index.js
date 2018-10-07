import ChartApp from "./react/ChartApp";
import style from "./sass/main.scss";

const countries = [
  'Belgium', 'France', 'Luxembourg', 'Germany', 'The Netherlands', 'Spain', 'Italy', 'Greece',
  'Portugal', 'Austria', 'Denmark', 'Norway', 'Sweden', 'Finland', 'Ireland', 'Poland', 'Estonia',
  'Czech Republic', 'Latvia', 'Lithuania', 'Slovak Republic', 'United Kingdom', 'Croatia', 'Serbia',
  'Bosnia and Herzegovina', 'Bulgaria', 'Czech Republic', 'Hungary', 'Slovenia', 'Switzerland'];

function getCountryData(country, year){
  const endpoint = `http://api.population.io/1.0/population/${year}/${country}/`;
  const result = [];
  fetch(endpoint)
    .then(response => {
      response.json().then((data) => {
        result.push(...data);
      });
    }).catch(function(err) {
      //console.log('Fetch Error :-S', err);
      result.push(false);
  });
  //console.log('data gotten');
  return result;
}

//console.log(getCountryData('Belgium', 2018));

function calculateTotalPopulation(arr){
  //console.log(arr);
  /*const total = arr.reduce((acc, curr) => {
    //acc = acc + curr.total;
    //console.log('test');
    //return acc;
    console.log(curr);
    //return acc + curr.total;
  }, 0);
  return total;*/
  //console.log()
  arr.map(item => {
    //console.log(item);
  });
  //console.log(total);
}

const countriesData = countries.map(country => getCountryData(country, 2018));
//console.log(countriesData);

//const countriesTotalPopulations = countriesData.map(countryData => calculateTotalPopulation(countryData));

const aCountry = getCountryData('Belgium', 2018);
const aPop = calculateTotalPopulation(aCountry);
//console.log(aCountry, aPop);

//console.log(countriesTotalPopulations);
