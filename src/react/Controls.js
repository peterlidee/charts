import React from 'react';

const Controls = (props) => {
  //console.log(props.years);
  return(
    <div>
      <input type="button" value="All countries" id="all" onClick={(e) => props.handleControles(e)} />
      {props.view === 'single' &&
        <label>Year:
          <input id="year"
            type="number"
            value={props.year}
            max={props.years.sort((a, b) => a < b)[0]}
            min={props.years.sort((a, b) => a > b)[0]}
            onChange={(e) => props.handleControles(e)} />
        </label>
      }
      <label>Choose a country
        <select value={props.country || ''} id="country" onChange={(e) => props.handleControles(e)}>
          <option value=""></option>
          {props.countries.sort().map(country => <option key={country} value={country}>{country}</option>)}
        </select>
      </label>
      <input type="button" value="clear" id="clear" onClick={(e) => props.handleControles(e)} />
    </div>
  );
}

export default Controls;
