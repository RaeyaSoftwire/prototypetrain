import React from 'react';
import Block from './Block';
import { formatPrice } from '../utility/format';

import LargeChevron from '../data/icon/large-chevron';

import './TicketResult.css';

export default class TicketResult extends React.Component {
  render() {
    const { data, onClick, onConditionsClick, onPriceBreakdownClick } = this.props;

    return (
      <Block onClick={onClick}>
        <div className="TicketResult">
          <div className="TicketResult-top">
            <div className="TicketResult-top-content">
              {data.priceLabel && <div className="TicketResult-priceLabel">
                {data.priceLabel}
              </div>}
              <div className="TicketResult-header">
                <div className="TicketResult-title">
                  {data.name}
                </div>
                <div className="TicketResult-price">
                  {formatPrice(data.price)}
                </div>
              </div>
              {false && <div className="TicketResult-note">
                Only 4 available
              </div>}
            </div>
            <LargeChevron className="TicketResult-chevron" />
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
