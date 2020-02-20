import React from 'react';
import { connect } from 'react-redux';
import Header from '../ui/Header';
import Button from '../ui/Button';
import Block from '../ui/Block';
import { changeScreen } from '../redux/actions';
import paymentScreen from '../data/payment.png';

import './Payment.css';

const mapDispatchToProps = dispatch => {
  return {
    changeScreen: id => dispatch(changeScreen(id)),
  };
};

class Payment extends React.Component {
  getPreviousScreenId() {
    return 5;
  }

  goToPreviousScreen() {
    const { changeScreen } = this.props;

    changeScreen(this.getPreviousScreenId());
  }

  getNextScreenId() {
    return 7;
  }

  goToNextScreen() {
    const { changeScreen } = this.props;

    changeScreen(this.getNextScreenId());
  }

  render() {
    return (
      <div className="Payment">
        <Header title="Pay with saved card" onBackClick={() => this.goToPreviousScreen()} />
        <img src={paymentScreen} className="Payment-fakeContent" />
        <Button text="Pay" onClick={() => this.goToNextScreen()} />
      </div>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(Payment);