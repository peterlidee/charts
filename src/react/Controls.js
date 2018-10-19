import React from 'react';

const Controls = (props) => {
  //console.log(props.years);
  return(

    <div className="controls">

      <div className="controle controle--1">
        <label className="select__label">Pick a year:
          <div className="select__wrapper">
            <select value={props.year} id="year" onChange={(e) => props.handleControles(e)} className="select__style">
              {props.view === 'single' && props.years4Single.sort().map(year => <option key={year} value={year}>{year}</option>)}
              {props.view === 'all' && props.years4All.sort().map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>
        </label>
      </div>

      <div className="controle controle--2">
        <label className="select__label">Pick a country:
          <div className="select__wrapper">
            <select value={props.country || ''} id="country" onChange={(e) => props.handleControles(e)} className="select__style">
              {props.view === 'all' && <option value=""></option>}
              {props.countries.sort().map(country => <option key={country} value={country}>{country}</option>)}
            </select>
          </div>
        </label>
      </div>

      <div className="controle controle--3">
        <input type="button" value="clear" id="clear" onClick={(e) => props.handleControles(e)} disabled={props.country === ''} className="controle__button" />
      </div>

    </div>

  );
}

export default Controls;
