import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";

import Controls from "./Controls";
import AllCountries from "./AllCountries";
import SingleCountries from "./SingleCountries";
import Footer from "./Footer";
import NotFound from "./NotFound";

// set some default values for all charts
// no further default possible, too different :/
import { defaults } from 'react-chartjs-2';
defaults.global.tooltips.mode = 'index';
defaults.global.tooltips.intersect = false;
defaults.global.tooltips.position = 'nearest';
defaults.global.tooltips.xPadding = 10;
defaults.global.tooltips.yPadding = 10;

class ChartApp extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      year: 2018,
    }
    // we need this ref to handle click on label, see handleCountrySelect
    this.countryOverviewRef = React.createRef();
    this.handleCountrySelect = this.handleCountrySelect.bind(this);
    this.handleControles = this.handleControles.bind(this);
  }

  handleCountrySelect(){
    // this handles 2 events: click on tick label or click on bar (AllCountries only)
    // get the ref inside the ref
    const ref = this.countryOverviewRef.current.horizontalBarRef.current;
    const tickLabel = ref.chartInstance.labelTick;
    const barLabel = ref.chartInstance.labelBar;

    if(tickLabel){ this.props.history.push(tickLabel) };
    if(barLabel){ this.props.history.push(barLabel) };
  }

  handleControles(e){

    // we could have handled clear and country in the comp itself by using
    // history.push but we didn't because see comments clear
    // so, we didn't do it with country either
    // this did require us to wrap ChartApp (this) in a withRouter

    if(e.target.id === 'clear'){

      // if the view changes from single to all there is a potential problem
      // because the all view is only available 2013+ (single 1998+)
      // so we need to handle this

      if(this.state.year < 2014){
        this.setState({ year: 2014 });
      }
      this.props.history.push('/');

    }else if(e.target.id === 'country'){ // on country change, use router
      this.props.history.push(e.target.value);
    }else if(e.target.id === 'year'){ // on year change, use state
      this.setState({ year: e.target.value });
    }
  }

  render(){

    return (
      <>

        <Controls
          year={this.state.year}
          handleControles={this.handleControles}
          pathName={this.props.location.pathname}
          />

        <div className="container">
          <Switch>

            <Route exact
              path="/"
              render={props =>
                <AllCountries {...props}
                  handleCountrySelect={this.handleCountrySelect}
                  ref={this.countryOverviewRef}
                  year={this.state.year} />
            }/>

            <Route
              path="/notfound"
              render={props =>
                <NotFound {...props} />
            }/>

            <Route
              path="/:country"
              render={props =>
                <SingleCountries {...props}
                  year={this.state.year} />
            }/>

            <Route
              render={props =>
                <NotFound {...props} />
            }/>

          </Switch>
        </div>

        <Footer />

      </>
    );
  };
};

export default withRouter(ChartApp);
