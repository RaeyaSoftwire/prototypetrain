import React from 'react';
import { connect } from 'react-redux';
import Header from '../ui/Header';
import { changeScreen } from '../redux/actions';
import userCases from '../data/userCases';

import './Confirmation.css';

const mapStateToProps = state => {
  return {
    usercase: userCases.find(uc => uc.id === state.usercase),
    results: state.results,
    selection: state.selection,
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

  render() {
    const { usercase } = this.props;
    
    return (
      <div className="Confirmation">
        <Header title="Booking complete" noBack hasClose onCloseClick={() => this.goToFirstScreen()} />
        <img src={usercase.confirmation} className="Confirmation-fakeContent" />
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Confirmation);