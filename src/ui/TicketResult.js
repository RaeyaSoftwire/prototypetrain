import React from 'react';
import Block from './Block';
import Badge from './Badge';
import { formatPrice } from '../utility/format';

import './TicketResult.css';

export default class TicketResult extends React.Component {
  getBadges() {
    const { data } = this.props;

    if (data.badgeText || data.isDiscounted) {
      return (
        <div className="TicketResult-badges">
          {data.badgeText && <Badge cheapest text={data.badgeText} />}
          {data.isDiscounted && <Badge discounted text="Discounted" />}
        </div>
      );
    }

    return null;
  }

  render() {
    const { data, onClick, onConditionsClick } = this.props;

    const { name, price, routeRestriction } = data;

    return (
      <Block onClick={onClick}>
        <div className="TicketResult">
          {this.getBadges()}
          <div className="TicketResult-top">
            <div className="TicketResult-title">
              {name}
            </div>
            <div className="TicketResult-price">
              {formatPrice(price)}
            </div>
          </div>
          <div className="TicketResult-bottom">
            <div className="TicketResult-description">
              {routeRestriction}
            </div>
            <div className="TicketResult-terms" onClick={e => { onConditionsClick(e); e.stopPropagation() }}>
              Terms and conditions
            </div>
          </div>
        </div>
      </Block>
    )
  }
}
