import React from 'react';
import Controls from "./Controls";
import { Link } from 'react-router-dom';

const NotFound = (props)=> {
  console.log(props)
  return(
    <>

      {/*}<Controls
        //view={this.state.view}
        //country={''}
        //countries={this.countries}
        //props={this.props}
        history={props.history}
        match={props.match}
        year={props.year}
        //years4Single={this.years4Single}
        //years4All={this.years4All}
        handleControles={props.handleControles} />*/}

        <div className="chart__container">
          <h2 className="chart__title">Not Found</h2>
          <p>There's no data available for this selection. Go to the <Link to='/'>start page</Link> and try again.</p>
        </div>

    </>

  );
}

export default NotFound;
