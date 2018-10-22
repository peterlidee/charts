import React from 'react';
import {Link} from 'react-router-dom';

// this comp serves as a fallback
// incase anybody changes the url to /country/ this comp will be served
// though it will not be directly linked anywhere

const SelectCountry = (props) => {
  return(
    <div className="chart__container selectCountry">
      <h2 className="chart__title">Pick a country</h2>
      <div className="countries__list">
        {props.countries.map(country => {
          return (
            //<a href="#" key={country}>{country}</a>
            <Link to={`/${country}`} key={country}>{country}</Link>
          );
        })}
      </div>
    </div>
  );
}

export default SelectCountry;
