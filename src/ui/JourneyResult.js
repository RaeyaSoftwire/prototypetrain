import React from 'react';
import Block from './Block';
import Badge from './Badge';
import { formatPrice } from '../utility/format';

import logo from '../data/logo.svg';

import './JourneyResult.css';

export default class JourneyResult extends React.Component {
  getDurationString() {
    const { data } = this.props;

    const hours = Math.floor(data.time.duration / 60).toFixed(0);
    const minutes = (data.time.duration % 60).toFixed(0).padStart(2, '0');

    if (hours === '0') {
      return `${minutes}m`;
    } else {
      return `${hours}h ${minutes}m`;
    }
  }

  getChangesString() {
    const { data } = this.props;

    return data.changes === 0 ? 'Direct' : `${data.changes} changes`;
  }

  getBadges() {
    const { data } = this.props;

    const elements = [];

    if (data.isCheapest) {
      elements.push(<Badge cheapest text="Cheapest" />);
    }
    if (data.isFastest) {
      elements.push(<Badge fastest text="Fastest" />);
    }
    
    if (elements.length > 0) {
      return (
        <div className="JourneyResult-horizontal JourneyResult-badges">
          {elements}
        </div>
      );
    }

    return null;
  }

  render() {
    const { data, onClick, onJourneyInfoClick } = this.props;

    return (
      <Block className="JourneyResult" onClick={onClick}>
        {this.getBadges()}
        {data.priceLabel && <div className="JourneyResult-priceLabel">
          {data.priceLabel}
        </div>}
        <div className="JourneyResult-horizontal">
          <div className="JourneyResult-details">
            <div className="JourneyResult-time">
              {data.time.departure.format('HH:mm')} > {data.time.arrival.format('HH:mm')}
            </div>
            {(data.toc === 'GR') && <img src={logo} className="JourneyResult-logo" />}
          </div>
          <div className="JourneyResult-prices">
            <div className="JourneyResult-prices-standard">
              {formatPrice(data.price.standard)}
            </div>
            <div className="JourneyResult-prices-first">
              1st {formatPrice(data.price.first)}
            </div>
          </div>
        </div>
        <div className="JourneyResult-horizontal JourneyResult-bottom">
          <div className="JourneyResult-length">
            {this.getDurationString()}, {this.getChangesString()}
          </div>
          <div className="JourneyResult-info" onClick={e => {onJourneyInfoClick(); e.stopPropagation()}}>
            Journey info
          </div>
        </div>
      </Block>
    )
  }
}
