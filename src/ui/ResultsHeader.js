import React from 'react';

import './ResultsHeader.css';

export default class ResultsHeader extends React.Component {
  render() {
    const { data } = this.props;

    if (data.ticketType === 1) {
      return (
        <div className="ResultsHeader">
          <div className={`ResultsHeader-group ${data.stage === 0 ? 'selected' : ''}`}>
            <div className="ResultsHeader-title">
              1 - Going out
            </div>
            <div className="ResultsHeader-subtitle">
              {data.time.outbound.format('ddd DD MMM')}
            </div>
          </div>
          <div className={`ResultsHeader-group ${data.stage === 1 ? 'selected' : ''}`}>
            <div className="ResultsHeader-title">
              2 - Coming back
            </div>
            <div className="ResultsHeader-subtitle">
              {data.time.inbound.format('ddd DD MMM')}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="ResultsHeader">
        <div className="ResultsHeader-group selected">
          <div className="ResultsHeader-subtitle">
            {data.time.outbound.format('ddd DD MMM')}
          </div>
        </div>
      </div>
    )

  }
}
