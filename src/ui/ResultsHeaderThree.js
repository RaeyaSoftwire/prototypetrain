import React from 'react';

import './ResultsHeaderThree.css';

export default class ResultsHeaderThree extends React.Component {
  render() {
    const { title, subtitle } = this.props;

    return (
      <React.Fragment>
        <div className="ResultsHeaderThree">
          <div className="ResultsHeaderThree-title">
            {title}
          </div>
          <div className="ResultsHeaderThree-subtitle">
            {subtitle}
          </div>
        </div>
        <div className="ResultsHeaderThree-padder" />
      </React.Fragment>
    );
  }
}
