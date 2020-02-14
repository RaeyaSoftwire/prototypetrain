import React from 'react';
import { connect } from 'react-redux';
import Header from '../ui/Header';
import Button from '../ui/Button';
import Block from '../ui/Block';
import { changeScreen } from '../redux/actions';
import { formatPrice } from '../utility/format';

import paymentCode from '../data/payment-code.png';
import paymentNew from '../data/payment-new.png';

import './Payment.css';

const methods = [
  {
    id: 0,
    title: 'American Express ****8172',
    description: 'Expires 07/2023',
  },
  {
    id: 1,
    title: 'MasterCard ****0880',
    description: 'Expires 05/2021',
  },
  {
    id: 2,
    title: 'New payment card',
  },
  {
    id: 3,
    title: 'PayPal',
  },
];

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

class Payment extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      method: 0,
      step: 0,
    };
  }

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

  presentTicket(data) {
    const { name, price, description, discounts } = data;

    return (
      <div className="Payment-breakdown-ticket">
        <div className="Payment-breakdown-ticket-row">
          <div className="Payment-breakdown-ticket-title">
            {name}
          </div>
          <div className="Payment-breakdown-ticket-price">
            {formatPrice(price)}
          </div>
        </div>
        <div className="Payment-breakdown-ticket-row">
          <div className="Payment-breakdown-ticket-description">
            {description}
          </div>
        </div>
        {discounts.map((discount, index) => {
          return (
            <div key={index} className="Payment-breakdown-ticket-row">
              <div className="Payment-breakdown-ticket-discountName">
                {discount.name}
              </div>
              <div className="Payment-breakdown-ticket-discountPrice">
                {formatPrice(discount.price)}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  presentMethod(data) {
    const { id, title, description } = data;
    const { method } = this.state;

    return (
      <Block key={id} onClick={() => this.setState({ method: id })} className={`Payment-method${id === method ? '--selected' : ''}`}>
        <div className="Payment-method-title">
          {title}
        </div>
        <div className="Payment-method-description">
          {description}
        </div>
      </Block>
    );
  }

  render() {
    const { method, step } = this.state;

    switch (step) {
      case 0:
        return (
          <div className="Payment">
            <Header title="Payment" onBackClick={() => this.goToPreviousScreen()} />
            <div className="Payment-content">
              <h2>Price breakdown</h2>
              <Block>
                <div className="Payment-tickets-title">
                  Tickets
                </div>
                {this.presentTicket({
                  name: '1x Advance Single (std.)',
                  price: 3500,
                  description: 'London King\'s Cross to York',
                  discounts: [
                    {
                      name: '5% off journeys to York',
                      price: -175,
                    },
                    {
                      name: 'Split ticket discount',
                      price: -375,
                    },
                  ],
                })}
              </Block>
              <h2>Choose payment method</h2>
              <div className="Payment-methods">
                {methods.map(method => this.presentMethod(method))}
              </div>
              <Button text="Make payment" onClick={() => this.setState({ step: 1 })} />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="Payment">
            <Header title="Payment" onBackClick={() => this.setState({ step: 0 })} />
            {(() => {
              switch (method) {
                case 0:
                case 1:
                  return <img src={paymentCode} className="Payment-fakeContent" />;
                case 2:
                  return <img src={paymentNew} className="Payment-fakeContent" />;
                case 3:
                  return <div>PayPal</div>;
              }
            })()}
            <Button text="Pay" onClick={() => this.goToNextScreen()} />
          </div>
        );
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Payment);