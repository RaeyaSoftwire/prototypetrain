import React from 'react';

import './ResultsHeaderThreeMix.css';

export default class ResultsHeaderThree extends React.Component {
  render() {
    const { legNumber, outboundTime, inboundTime } = this.props;

    return (
      <React.Fragment>
        <div className="ResultsHeaderThreeMix">
          <div className={`ResultsHeaderThreeMix-group ${legNumber === 0 ? 'selected' : ''}`}>
            <div className="ResultsHeaderThreeMix-title">
              1 - Outbound
            </div>
            <div className="ResultsHeaderThreeMix-subtitle">
              {outboundTime}
            </div>
          </div>
          <div className={`ResultsHeaderThreeMix-group ${legNumber === 1 ? 'selected' : ''}`}>
            <div className="ResultsHeaderThreeMix-title">
              2 - Return
            </div>
            <div className="ResultsHeaderThreeMix-subtitle">
              {inboundTime}
            </div>
          </div>
        </div>
        <div className="ResultsHeaderThreeMix-padder" />
      </React.Fragment>
    );
  }
}
