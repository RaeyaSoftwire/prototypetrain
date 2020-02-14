import React from 'react';

import './Badge.css';

export default class Block extends React.Component {
  getClassName() {
    const { cheapest, fastest, discounted } = this.props;

    return `Badge ${cheapest ? 'Badge-cheapest' : ''} ${fastest ? 'Badge-fastest' : ''} ${discounted ? 'Badge-discounted' : ''}`
  }

  render() {
    const { text } = this.props;

    return (
      <div className={this.getClassName()}>
        {text}
      </div>
    )
  }
}
