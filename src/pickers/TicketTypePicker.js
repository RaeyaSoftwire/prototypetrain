import React from 'react';
import ticketTypes from '../data/ticketTypes';
import { getTicketTypeIcon } from '../utility/get';

import './TicketTypePicker.css';

export default class TicketTypePicker extends React.Component {
  render() {
    const { selected, onSelect } = this.props;

    return (
      <div className="TicketTypePicker">
        {ticketTypes.map(ticketType => (
          <div className={`TicketTypePicker-section ${ticketType.id === selected ? 'selected' : ''}`} key={ticketType.id} onClick={() => onSelect(ticketType.id)}>
            {getTicketTypeIcon(ticketType.id, 'TicketTypePicker-section-icon')}
            <div className="TicketTypePicker-section-label">
              {ticketType.name}
            </div>
          </div>
        ))}
      </div>
    )
  }
}
