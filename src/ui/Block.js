import React from 'react';

import './Block.css';

export default class Block extends React.Component {
  render() {
    const { className, children, onClick } = this.props;

    return (
      <div className={`Block ${className}`} onClick={onClick}>
        {children}
      </div>
    )
  }
}
