import React from 'react';
import BackIcon from '../data/icon/back';

import './Header.css';

export default class Header extends React.Component {
  getBackButton() {
    const { noBack, onBackClick } = this.props;
    
    if (noBack) {
      return <div className="Header-left Header-button" />
    }
    else {
      return (
        <button className="Header-left Header-button" onClick={onBackClick}>
          <BackIcon className="Header-button-icon" />
        </button>
      );
    }
  }

  getCloseButton() {
    const { hasClose, onCloseClick } = this.props;
    
    if (hasClose) {
      return (
        <button className="Header-right Header-button" onClick={onCloseClick}>
          Close
        </button>
      );
    }
    else {
      return <div className="Header-right Header-button" />
    }
  }

  render() {
    const { title, noBack, onBackClick } = this.props;

    return (
      <React.Fragment>
        <header className="Header">
          {this.getBackButton()}
          <div className="Header-title">
            {title}
          </div>
          {this.getCloseButton()}
        </header>
        <div className="Header-padder" />
      </React.Fragment>
    )
  }
}
