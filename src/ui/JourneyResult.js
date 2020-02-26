import React from 'react';
import Block from './Block';
import Badge from './Badge';
import { formatPrice } from '../utility/format';
import { getChangesString, getDurationString } from '../utility/get';

import PersonIcon from '../data/icon/person';
import LargeChevron from '../data/icon/large-chevron';
import logo from '../data/logo.svg';

import './JourneyResult.css';

export default class JourneyResult extends React.Component {
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
        <div className="JourneyResult-horizontal JourneyResult-top">
          <div className="JourneyResult-top-content">
            <div className="JourneyResult-horizontal">
              {(data.toc === 'GR') && <img src={logo} className="JourneyResult-logo" />}
              {this.getBadges()}
            </div>
            {data.priceLabel && <div className="JourneyResult-priceLabel">
              {data.passengers}
              <PersonIcon className="JourneyResult-personIcon" />
              {data.priceLabel}
            </div>}
            <div className="JourneyResult-horizontal">
              <div className="JourneyResult-details">
                <div className="JourneyResult-time">
                  {data.time.departure.format('HH:mm')} > {data.time.arrival.format('HH:mm')}
                </div>
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
          </div>
          <LargeChevron className="JourneyResult-chevron" />
        </div>
        <div className="JourneyResult-horizontal JourneyResult-bottom">
          <div className="JourneyResult-length">
            {getDurationString(data.time.departure, data.time.arrival)}, {getChangesString(data.changes)}
          </div>
          <div className="JourneyResult-info" onClick={e => {onJourneyInfoClick(); e.stopPropagation()}}>
            Journey info
          </div>
        </div>
      </Block>
    )
  }
}
