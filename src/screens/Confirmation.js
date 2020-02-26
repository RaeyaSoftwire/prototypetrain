import React from 'react';
import { connect } from 'react-redux';
import Header from '../ui/Header';
import { changeScreen } from '../redux/actions';
import userCases from '../data/userCases';
import confirmationScreen from '../data/confirmation.png';

import './Confirmation.css';

const mapStateToProps = state => {
  return {
    usercase: userCases.find(uc => uc.id === state.usercase),
    results: state.results,
    selection: state.selection,
    search: state.search,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeScreen: id => dispatch(changeScreen(id)),
  };
};

class Confirmation extends React.Component {
  goToFirstScreen() {
    const { changeScreen } = this.props;

    changeScreen(0);
  }

  getHeader() { 
    const { search } = this.props;

    const data = {
      station: {
        origin: search.from,
        destination: search.to,
      },
      ticketType: search.ticketType,
    };

    return (
      <Header data={data} onBackClick={() => this.goToFirstScreen()} />
    );
  }

  render() {
    const { usercase } = this.props;
    
    return (
      <div className="Confirmation">
        {this.getHeader()}
        <img src={confirmationScreen} className="Confirmation-fakeContent" />
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Confirmation);