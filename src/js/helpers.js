// format number from 10000 to '10.000'
export function prettyfyPopulationNum(num){
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


// make an array for all the years between 2018 - (2018-num)
export function renderYearsArray(num){
  let years = [];
  for(let i = 0; i < num; i++){
    years.push(2018 - i);
  }
  return years;
}

// extract year from date 2018-01-01 -> 2018
export function getYearFromDate(date){
  return +date.split('-')[0];
}


// this does the fetch to the api
export function doFetch(arr, param){
  return arr.map(item => {
    // all countries in 2018 -> state.view all
    // http://api.population.io/1.0/population/${country}/2018-01-01/ -> min 2013 !!!
    // all years -> state.view single
    // http://api.population.io/1.0/population/${year}/Belgium/
    const endpoint = `https://api.population.io/1.0/population/${item}/${param}/`;
    //console.log(endpoint);
    return fetch(endpoint)
      .then(response => {
        // return false as value if the response was not ok
        return response.ok ? response.json() : false;
      })
  });
}
