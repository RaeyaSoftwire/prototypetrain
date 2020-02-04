import React from 'react';
import moment from 'moment';

import './JourneyResult.css';

export default class JourneyResult extends React.Component {
  formatPrice(price) {
    if (price) {
      return `£${(price / 100).toFixed(0)}.${(price % 100).toFixed(0).padStart(2, '0')}`;
    }
  }

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

  render() {
    const { data } = this.props;

    // needs to show fastest or cheapest too

    return (
      <div className="JourneyResult">
        <div className="JourneyResult-top">
          <div className="JourneyResult-time">
            {data.departureTime.format('kk:mm')} -> {data.arrivalTime.format('kk:mm')}
          </div>
          <div className="JourneyResult-prices">
            <div className="JourneyResult-prices-standard">
              {this.formatPrice(data.standardPrice)}
            </div>
            <div className="JourneyResult-prices-first">
              1st {this.formatPrice(data.firstPrice)}
            </div>
          </div>
        </div>
        <div className="JourneyResult-bottom">
          <div className="JourneyResult-length">
            {this.getDurationString()}, Direct?
          </div>
          <div className="JourneyResult-info">
            Journey info
          </div>
        </div>
      </div>
    )
  }
}
