import React from 'react';
import { connect } from 'react-redux';
import Header from '../ui/Header';
import Button from '../ui/Button';
import { changeScreen } from '../redux/actions';
import paymentScreen from '../data/payment.png';

import './Payment.css';

const mapStateToProps = state => {
  const { search } = state;

  return {
    search,
  };
}

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
      <Header data={data} onBackClick={() => this.goToPreviousScreen()} />
    );
  }

  render() {
    return (
      <div className="Payment">
        {this.getHeader()}
        <img src={paymentScreen} className="Payment-fakeContent" />
        <Button text="Pay" onClick={() => this.goToNextScreen()} />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Payment);