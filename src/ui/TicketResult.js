import React from 'react';
import Block from './Block';
import Badge from './Badge';
import { formatPrice } from '../utility/format';

import './TicketResult.css';

export default class TicketResult extends React.Component {
  getBadges() {
    const { data } = this.props;

    const elements = [];

    if (data.badgeText) {
      elements.push(<Badge cheapest text={data.badgeText} />);
    }
    if (data.isDiscounted) {
      elements.push(<Badge discounted text="Discounted" />);
    }
    
    if (elements.length > 0) {
      return (
        <div className="TicketResult-badges">
          {elements}
        </div>
      );
    }

    return null;
  }

  render() {
    const { data, onClick, onConditionsClick, onPriceBreakdownClick } = this.props;

    return (
      <Block onClick={onClick}>
        <div className="TicketResult">
          {this.getBadges()}
          {data.priceLabel && <div className="TicketResult-priceLabel">
            {data.priceLabel}
          </div>}
          <div className="TicketResult-top">
            <div className="TicketResult-title">
              {data.name}
            </div>
            <div className="TicketResult-price">
              {formatPrice(data.totalPrice)}
            </div>
          </div>
          <div className="TicketResult-ticketPrice">
            Ticket {formatPrice(data.price)}
          </div>
          <div className="TicketResult-description">
            {data.description}
          </div>
          <div className="TicketResult-bottom">
            <div className="TicketResult-terms" onClick={e => { onConditionsClick(e); e.stopPropagation() }}>
              Full conditions
            </div>
            <div className="TicketResult-terms" onClick={e => { onPriceBreakdownClick(e); e.stopPropagation() }}>
              Price breakdown
            </div>
          </div>
        </div>
      </Block>
    )
  }
}
