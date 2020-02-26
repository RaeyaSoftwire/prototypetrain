import React from 'react';
import BackIcon from '../data/icon/back';
import { getTicketTypeIcon, getStationName } from '../utility/get';

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

  getTitle() {
    const { data } = this.props;
    
    if (data.station) {
      return (
        <div className="Header-middle">
          <div className="Header-firstStation">
            {getStationName(data.station.origin)}
          </div>
          <div className="Header-secondStation">
            {getTicketTypeIcon(data.ticketType, "Header-icon")}
            {getStationName(data.station.destination)}
          </div>
        </div>
      );
    }

    if (data.title) { 
      return (
        <div className="Header-middle">
          <div className="Header-title">
            {data.title}
          </div>
        </div>
      );
    }

    return (
      <div className="Header-middle" />
    )

  }
  render() {
    const { title, noBack, onBackClick } = this.props;

    return (
      <React.Fragment>
        <header className="Header">
          {this.getBackButton()}
          {this.getTitle()}
          {this.getCloseButton()}
        </header>
        <div className="Header-padder" />
      </React.Fragment>
    )
  }
}
