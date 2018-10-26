import React from 'react';
import { countries } from '../js/countries';
import { renderYearsArray } from '../js/helpers';

const Controls = (props) => {

  console.log('controles', props);

  const currCountry = props.pathName === '/' || props.pathName === '/notfound' ? '' : props.pathName.substring(1);
  const years = currCountry === '' ? renderYearsArray(5) : renderYearsArray(20);

  return(

    <div className="controls">

      <div className="controle controle--1">
        <label className="select__label">
          <span>Pick a year:</span>
          <div className="select__wrapper">
            <select value={props.year} id="year" onChange={(e) => props.handleControles(e)} className="select__style">
              { years.sort().map(year => <option key={year} value={year}>{year}</option>) }
            </select>
          </div>
        </label>
      </div>

      <div className="controle controle--2">
        <label className="select__label">
          <span>Pick a country:</span>
          <div className="select__wrapper">
            <select value={currCountry} id="country" onChange={(e) => props.handleControles(e)} className="select__style">
              {currCountry === '' && <option value=""></option>}
              {countries.sort().map(country => <option key={country} value={country}>{country}</option>)}
            </select>
          </div>
        </label>
      </div>

      <div className="controle controle--3">
        <input type="button" value="clear" id="clear" onClick={(e) => props.handleControles(e)} disabled={props.pathName === '/'} className="controle__button" />
      </div>

    </div>

  );
}

export default Controls;
