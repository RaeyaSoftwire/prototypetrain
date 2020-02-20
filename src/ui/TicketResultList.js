import React from 'react';
import TicketResult from './TicketResult';

import './TicketResultList.css';

export default class TicketResultList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownsOpen: new Array(props.data.categories.length).fill(false),
    };
  }

  toggleDropdown(id) {
    const { dropdownsOpen } = this.state;
    dropdownsOpen[id] = !dropdownsOpen[id];

    this.setState({
      dropdownsOpen,
    });
  }

  presentTickets(tickets) {
    const { onClick, onConditionsClick, onPriceBreakdownClick } = this.props;

    return tickets.map(ticket => <TicketResult key={ticket.id} data={ticket} onClick={() => onClick(ticket.id)} onConditionsClick={() => onConditionsClick(ticket.id)} onPriceBreakdownClick={() => onPriceBreakdownClick(ticket.id)} />);
  }

  render() {
    const { data } = this.props;

    const { highlights, categories } = data;
    const { dropdownsOpen } = this.state;
    
    return (
      <div className="TicketResultList">
        <h3>Recommended tickets</h3>
        <div className="TicketResultList-group">
          {this.presentTickets(highlights)}
        </div>  
        {categories.map((category, index) => {
          const open = dropdownsOpen[index];
          return (
            <div className="TicketResultList-dropdown">
              <div className="TicketResultList-dropdown-control" onClick={() => this.toggleDropdown(index)}>
                <div className="TicketResultList-dropdown-title">
                  {category.title}
                </div>
                <div className={`TicketResultList-dropdown-chevron ${open ? 'rotated' : ''}`}>
                  v
                </div>
              </div>
              {open && <div className="TicketResultList-dropdown-content">
                <div className="TicketResultList-group">
                  {this.presentTickets(category.tickets)}
                </div>  
              </div>}
            </div>
          );
        })}
      </div>
    );
  }
}
