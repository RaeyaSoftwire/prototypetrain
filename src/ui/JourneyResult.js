import React from 'react';
import Block from './Block';
import Badge from './Badge';
import { formatPrice } from '../utility/format';

import logo from '../data/logo.svg';

import './JourneyResult.css';

export default class JourneyResult extends React.Component {
  getDurationString() {
    const { data } = this.props;
    const { departureTime, arrivalTime } = data;

    const totalMinutes = arrivalTime.diff(departureTime, 'minutes');

    const hours = Math.floor(totalMinutes / 60).toFixed(0);
    const minutes = (totalMinutes % 60).toFixed(0).padStart(2, '0');

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

    if (data.isCheapest || data.isFastest || data.isDiscounted) {
      return (
        <div className="JourneyResult-horizontal JourneyResult-badges">
          {data.isCheapest && <Badge cheapest text="Cheapest" />}
          {data.isFastest && <Badge fastest text="Fastest" />}
          {data.isDiscounted && <Badge discounted text="Discounted" />}
        </div>
      );
    }

    return null;
  }

  render() {
    const { data, onClick, onJourneyInfoClick, priceLabel } = this.props;

    return (
      <Block className="JourneyResult" onClick={onClick}>
        {this.getBadges()}
        {priceLabel && <div className="JourneyResult-priceLabel">
          {priceLabel}
        </div>}
        <div className="JourneyResult-horizontal">
          <div className="JourneyResult-details">
            <div className="JourneyResult-time">
              {data.departureTime.format('HH:mm')} > {data.arrivalTime.format('HH:mm')}
            </div>
            <img src={logo} className="JourneyResult-logo" />
          </div>
          <div className="JourneyResult-prices">
            <div className="JourneyResult-prices-standard">
              {formatPrice(data.standardPrice)}
            </div>
            <div className="JourneyResult-prices-first">
              1st {formatPrice(data.firstPrice)}
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
