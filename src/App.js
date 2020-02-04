import React from 'react';
import Results from './screens/Results';
import Search from './screens/Search';

import './App.css';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return {
    screen: state.screens.screen,
  };
}

class App extends React.Component {
  getScreen() {
    const { screen } = this.props;

    switch (screen) {
      case 0:
        return <Search />;
      case 1:
        return <Results />;
      defult:
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