import React from 'react';
import TicketResult from './TicketResult';
import { formatPrice } from '../utility/format';

import './TicketResultList.css';

export default class TicketResultList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fixedDropdownOpen: false,
      flexibleDropdownOpen: false,
    };
  }

  presentTicketList(tickets) {
    const { onClick, onConditionsClick } = this.props;

    return (
      <div className="TicketResultList-group">
        {tickets.map(ticket => {
          if (ticket) {
            return (
              <TicketResult key={ticket.id} data={ticket} onClick={() => onClick(ticket.id)} onConditionsClick={() => onConditionsClick(ticket.id)} />
            );
          }
          return null;
        })}
      </div>
    );
  }

  toggleFixedDropdown() {
    this.setState({
      fixedDropdownOpen: !this.state.fixedDropdownOpen,
    });
  }

  toggleFlexibleDropdown() {
    this.setState({
      flexibleDropdownOpen: !this.state.flexibleDropdownOpen,
    });
  }

  render() {
    const { data } = this.props;

    const { DisplayFaresFixed, DisplayFaresFlexible } = data;
    const DisplayFares = DisplayFaresFixed.concat(DisplayFaresFlexible);

    const tickets = DisplayFares
      .filter(displayFare => displayFare.Available)
      .map((displayFare, index) => {
        return {
          id: index,
          first: displayFare.TicketClass === 'First',
          name: displayFare.DisplayName,
          price: displayFare.TotalPrice,
          routeRestriction: displayFare.RouteRestrictionDisplayName,
          isFlexible: displayFare.IsFlexible,
          badgeText: null,
          isDiscounted: displayFare.IsDiscounted,
        };
      });

    const cheapestFirstTicket = tickets
      .filter(ticket => ticket.first)
      .sort((a, b) => a.price - b.price)[0];

    const cheapestStandardTicket = tickets
      .filter(ticket => !ticket.first)
      .sort((a, b) => a.price - b.price)[0];

    const cheapestFlexibleTicket = tickets
      .filter(ticket => ticket.isFlexible)
      .sort((a, b) => a.price - b.price)[0];
    
    let cheapestTickets = [cheapestStandardTicket, cheapestFirstTicket];

    cheapestFirstTicket.badgeText = 'Cheapest 1st Class';
    cheapestStandardTicket.badgeText = 'Cheapest journey';

    if (cheapestFirstTicket.id !== cheapestFlexibleTicket.id && cheapestStandardTicket.id !== cheapestFlexibleTicket.id) {
      cheapestFlexibleTicket.badgeText = 'Cheapest flexible ticket';
      cheapestTickets.push(cheapestFlexibleTicket);
    }

    const isOtherTicket = id => !cheapestTickets.some(ticket => ticket.id === id);
    
    const otherFixedTickets = tickets.filter(ticket => !ticket.isFlexible && isOtherTicket(ticket.id));
    const otherFlexibleTickets = tickets.filter(ticket => ticket.isFlexible && isOtherTicket(ticket.id));

    const otherFixedMinPrice = Math.min(...otherFixedTickets.map(ticket => ticket.price));
    const otherFlexibleMinPrice = Math.min(...otherFlexibleTickets.map(ticket => ticket.price));

    const { fixedDropdownOpen, flexibleDropdownOpen } = this.state;
    
    return (
      <div className="TicketResultList">
        {this.presentTicketList(cheapestTickets)}
        {otherFixedTickets.length > 0 && <div className="TicketResultList-dropdown">
          <div className="TicketResultList-dropdown-control" onClick={() => this.toggleFixedDropdown()}>
            <div className="TicketResultList-dropdown-title">
              More fixed price fares from {formatPrice(otherFixedMinPrice)}
            </div>
            <div className={`TicketResultList-dropdown-chevron ${fixedDropdownOpen ? 'rotated' : ''}`}>
              v
            </div>
          </div>
          {fixedDropdownOpen && <div className="TicketResultList-dropdown-content">
            {this.presentTicketList(otherFixedTickets)}
          </div>}
        </div>}
        {otherFlexibleTickets.length > 0 && <div className="TicketResultList-dropdown">
          <div className="TicketResultList-dropdown-control" onClick={() => this.toggleFlexibleDropdown()}>
            <div className="TicketResultList-dropdown-title">
              More flexible fares from {formatPrice(otherFlexibleMinPrice)}
            </div>
            <div className={`TicketResultList-dropdown-chevron ${flexibleDropdownOpen ? 'rotated' : ''}`}>
              v
            </div>
          </div>
          {flexibleDropdownOpen && <div className="TicketResultList-dropdown-content">
            {this.presentTicketList(otherFlexibleTickets)}
          </div>}
        </div>}
      </div>
    );
  }
}
