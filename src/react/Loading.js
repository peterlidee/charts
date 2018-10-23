import React from 'react';
import {colors} from '../js/colors';

const Loading = ()=> {
  return(
    <div className="container__loader">
      <div className="loader">
        <div className="loader__item" style={{background: colors.yellow}} />
        <div className="loader__item" style={{background: colors.yellow}} />
        <div className="loader__item" style={{background: colors.yellow}} />
      </div>
    </div>
  );
}

export default Loading;
