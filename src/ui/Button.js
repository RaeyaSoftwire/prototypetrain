import React from 'react';

import './Button.css';

export default class Button extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    const { onClick, loading, disabled } = this.props;

    if (!loading && !disabled ) {
      onClick(e)
    }
  }

  render() {
    const { text, loading, disabled } = this.props;

    return (
      <button className={`Button ${disabled ? 'disabled' : ''}`} onClick={this.handleClick}>
        {loading ? 'Loading...' : text}
      </button>
    )
  }
}
