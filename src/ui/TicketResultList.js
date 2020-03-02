import React from 'react';
import TicketResult from './TicketResult';

import './TicketResultList.css';

export default class TicketResultList extends React.Component {
  render() {
    const { data, onClick, onConditionsClick, onPriceBreakdownClick } = this.props;

    return (
      <div className="TicketResultList">
        {data.map(ticket => (
          <TicketResult className="TicketResultList-ticket" key={ticket.id} data={ticket} onClick={() => onClick(ticket.id)} onConditionsClick={() => onConditionsClick(ticket.id)} onPriceBreakdownClick={() => onPriceBreakdownClick(ticket.id)} />
        ))}
      </div>
    );
  }
}
