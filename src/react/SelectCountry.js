import React from 'react';

// this comp serves as a fallback
// incase anybody changes the url to /country/ this comp will be served
// though it will not be directly linked anywhere

const SelectCountry = (props) => {
  console.log(props.countries)
  return(
    <div className="chart__container selectCountry">
      <h2 className="chart__title">Pick a country</h2>
      <div className="countries__list">
        {props.countries.map(country => {
          //<Link to={`country/${country}`} key={country}>{country}</Link>
          return (
            <a href="#" key={country}>{country}</a>
          );
        })}
      </div>
    </div>
  );
}

export default SelectCountry;
