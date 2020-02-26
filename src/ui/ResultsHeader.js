import React from 'react';

import './ResultsHeader.css';

export default class ResultsHeader extends React.Component {
  render() {
    const { stage } = this.props;


    return (
      <div className="ResultsHeader">
        <div className={`ResultsHeader-group ${stage === 0 ? 'selected' : ''}`}>
          <div className="ResultsHeader-title">
            1 - Going out
          </div>
          <div className="ResultsHeader-subtitle">
            Wahey 24 Feb
          </div>
        </div>
        <div className={`ResultsHeader-group ${stage === 1 ? 'selected' : ''}`}>
          <div className="ResultsHeader-title">
            2 - Coming back
          </div>
          <div className="ResultsHeader-subtitle">
            Weddddd 62 Feb
          </div>
        </div>
      </div>
    )
  }
}
