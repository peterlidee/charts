import React from 'react';
import NumberInput from './NumberInput';

const Controls = (props) => {
  //console.log(props.years);
  return(
    <div>
      <input type="button" value="All countries" id="all" onClick={(e) => props.handleControles(e)} disabled={props.country === ''} />

      {props.view === 'all' &&
        <NumberInput
          year={props.year}
          years={props.years4All}
          handleControles={props.handleControles} />}
      {props.view === 'single' &&
        <NumberInput
          year={props.year}
          years={props.years4Single}
          handleControles={props.handleControles} />}
          
      <label>Choose a country
        <select value={props.country || ''} id="country" onChange={(e) => props.handleControles(e)}>
          {props.view === 'all' && <option value=""></option>}
          {props.countries.sort().map(country => <option key={country} value={country}>{country}</option>)}
        </select>
      </label>
      <input type="button" value="clear" id="clear" onClick={(e) => props.handleControles(e)} disabled={props.country === ''} />
    </div>
  );
}

export default Controls;
