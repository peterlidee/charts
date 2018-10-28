import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = (props)=> {
  //console.log(props)
  return(
    <>
      <div className="chart__container">
        <h2 className="chart__title">Not Found</h2>
        <p>There's no data available for this selection. Go to the <Link to='/'>start page</Link> and try again.</p>
      </div>
    </>
  );
}

export default NotFound;
