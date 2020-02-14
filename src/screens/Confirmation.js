import React from 'react';
import { connect } from 'react-redux';
import Header from '../ui/Header';
import { changeScreen } from '../redux/actions';
import confirmationScreen from '../data/confirmation.png';

import './Confirmation.css';

const mapStateToProps = state => {
  console.log(state);
  return {
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
    return (
      <div className="Confirmation">
        <Header title="Booking complete" noBack hasClose onCloseClick={() => this.goToFirstScreen()} />
        <img src={confirmationScreen} className="Confirmation-fakeContent" />
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Confirmation);