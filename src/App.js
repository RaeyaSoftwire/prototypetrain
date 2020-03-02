import React from 'react';
import Results from './screens/Results';
import ResultsThree from './screens/ResultsThree';
import Search from './screens/Search';
import Review from './screens/Review';
import ReviewThree from './screens/ReviewThree';
import Payment from './screens/Payment';
import Confirmation from './screens/Confirmation';
import Menu from './screens/Menu';

import './App.css';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return {
    screen: state.screen,
  };
}

class App extends React.Component {
  getScreen() {
    const { screen } = this.props;

    const useThreeScreen = true;

    switch (screen) {
      case 0:
        return <Search />;
      case 1:
      case 2:
      case 3:
      case 4:
      case 10:
      case 11:
        if (useThreeScreen) {
          return <ResultsThree />;
        } else {
          return <Results />;
        }
      case 5:
        if (useThreeScreen) {
          return <ReviewThree />;
        } else {
          return <Review />;
        }
      case 6:
        return <Payment />;
      case 7:
        return <Confirmation />;
      case 100:
        return <Menu />;
      default:
        return <div>oh no</div>;
    };
  }

  render() {    
    return (
      <div className="App">
        <div id="App-mobileFrame">
          {this.getScreen()}
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  null
)(App);