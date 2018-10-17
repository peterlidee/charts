import React from 'react';

const NumberInput = (props) => {
  console.log(props.years);
  return(
    <label>Year:
      <input id="year"
        type="number"
        value={props.year}
        max={props.years.sort((a, b) => a < b)[0]}
        min={props.years.sort((a, b) => a > b)[0]}
        onChange={(e) => props.handleControles(e)} />
    </label>
  );
}

export default NumberInput;
