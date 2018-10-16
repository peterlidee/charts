import React from 'react';
import {colors} from '../colors';

const Loading = ()=> {
  return(
    <div className="loader">
      <div className="loader__item" style={{background: colors.yellow}} />
      <div className="loader__item" style={{background: colors.yellow}} />
      <div className="loader__item" style={{background: colors.yellow}} />
      <div className="loader__item" style={{background: colors.yellow}} />
    </div>
  );
}

export default Loading;
