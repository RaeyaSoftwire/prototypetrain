import React from 'react';
import ticketTypes from '../data/ticketTypes';

import SingleIcon from '../data/icon/single';
import ReturnIcon from '../data/icon/return';
import OpenReturnIcon from '../data/icon/open-return';
import SeasonIcon from '../data/icon/season';


import './TicketTypePicker.css';

export default class TicketTypePicker extends React.Component {
  getIcon(id) {
    switch (id) {
      case 0:
        return <SingleIcon className="TicketTypePicker-section-icon" />
      case 1:
        return <ReturnIcon className="TicketTypePicker-section-icon" />
      case 2:
        return <OpenReturnIcon className="TicketTypePicker-section-icon" />
      case 3:
        return <SeasonIcon className="TicketTypePicker-section-icon" />
      default:
        return null;
    }
  }
  
  render() {
    const { selected, onSelect } = this.props;

    return (
      <div className="TicketTypePicker">
        {ticketTypes.map(ticketType => (
          <div className={`TicketTypePicker-section ${ticketType.id === selected ? 'selected' : ''}`} key={ticketType.id} onClick={() => onSelect(ticketType.id)}>
            {this.getIcon(ticketType.id)}
            <div className="TicketTypePicker-section-label">
              {ticketType.name}
            </div>
          </div>
        ))}
      </div>
    )
  }
}
