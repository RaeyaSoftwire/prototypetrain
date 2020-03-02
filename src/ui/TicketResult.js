import React from 'react';
import Block from './Block';
import { formatPrice } from '../utility/format';
import Badge from './Badge';

import LargeChevron from '../data/icon/large-chevron';
import PersonIcon from '../data/icon/person';

import './TicketResult.css';

export default class TicketResult extends React.Component {
  render() {
    const { className, data, onClick, onConditionsClick, onPriceBreakdownClick } = this.props;

    return (
      <Block className={className} onClick={onClick}>
        <div className="TicketResult">
          <div className="TicketResult-top">
            <div className="TicketResult-top-content">
              <div className="JourneyResult-priceLabel">
                {data.passengers}
                <PersonIcon className="JourneyResult-personIcon" />
              </div>
              <div className="TicketResult-header">
                <div className="TicketResult-title">
                  {data.title}
                </div>
                <div className="TicketResult-price">
                  {formatPrice(data.price)}
                </div>
              </div>
              <div className="TicketResult-sub">
                <div className="TicketResult-note">
                  {data.descriptionLines.map(line => <div className="TicketResult-note-line">{line}</div>)}
                </div>
                {data.isDiscounted && <Badge discounted text="Discounted" />}
              </div>
            </div>
            <LargeChevron className="TicketResult-chevron" />
          </div>
          <div className="TicketResult-actions">
            <div className="TicketResult-action" onClick={e => { onConditionsClick(e); e.stopPropagation() }}>
              Ticket conditions
            </div>
            <div className="TicketResult-action" onClick={e => { onPriceBreakdownClick(e); e.stopPropagation() }}>
              Price breakdown
            </div>
          </div>
        </div>
      </Block>
    )
  }
}
