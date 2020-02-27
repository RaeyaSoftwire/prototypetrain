import React from 'react';

import './ResultsHeader.css';

export default class ResultsHeader extends React.Component {
  render() {
    const { data } = this.props;

    if (data.ticketType === 1 || data.ticketType === 2) {
      return (
        <React.Fragment>
          <div className="ResultsHeader">
            <div className={`ResultsHeader-group ${data.stage === 0 ? 'selected' : ''}`}>
              <div className="ResultsHeader-title">
                1 - Going out
              </div>
              <div className="ResultsHeader-subtitle">
                {data.time.outbound}
              </div>
            </div>
            <div className={`ResultsHeader-group ${data.stage === 1 ? 'selected' : ''}`}>
              <div className="ResultsHeader-title">
                2 - Coming back
              </div>
              <div className="ResultsHeader-subtitle">
                {data.time.inbound}
              </div>
            </div>
          </div>
          <div className="ResultsHeader-padder" />
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <div className="ResultsHeader ResultsHeader-small">
          <div className="ResultsHeader-group selected">
            <div className="ResultsHeader-subtitle">
              {data.time.outbound}
            </div>
          </div>
        </div>
        <div className="ResultsHeader-padder-small" />
      </React.Fragment>
    );
  }
}
