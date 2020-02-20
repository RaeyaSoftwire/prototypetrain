import React from 'react';

import './ResultsHeader.css';

export default class ResultsHeader extends React.Component {
  render() {
    const { title, subtitle, priceInfo } = this.props;

    const hasSubtitle = subtitle || priceInfo;

    return (
      <div className="ResultsHeader">
        <div className="ResultsHeader-title">
          {title}
        </div>
        {hasSubtitle && <div className="ResultsHeader-subtitle">
          {subtitle && <div className="ResultsHeader-subtitle-left">
            {subtitle}
          </div>}
          {priceInfo && <div className="ResultsHeader-subtitle-right">
            {priceInfo}
          </div>}
        </div>}
      </div>
    )
  }
}
