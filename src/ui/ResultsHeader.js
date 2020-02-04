import React from 'react';

import './ResultsHeader.css';

export default class ResultsHeader extends React.Component {
  render() {
    const { title, subtitle } = this.props;

    return (
      <div className="ResultsHeader">
        <div className="ResultsHeader-title">
          {title}
        </div>
        <div className="ResultsHeader-subtitle">
          {subtitle}
        </div>
      </div>
    )
  }
}
