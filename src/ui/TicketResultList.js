import React from 'react';
import TicketResult from './TicketResult';
import Accordion from '../ui/Accordion';

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

  presentHighlights(highlights) {  
    return (
      <div className="TicketResultList-highlights">
        {highlights.map((highlight, index) => {
          return (
            <div className="TicketResultList-highlight" key={index}>
              <div className="TicketResultList-highlight-title">
                {highlight.title}
              </div>
              {this.presentTickets([highlight.ticket])}
            </div>
          );
        })}
      </div>
    )
  }

  render() {
    const { data } = this.props;

    const { highlights, categories } = data;
    const { dropdownsOpen } = this.state;
    
    return (
      <div className="TicketResultList">
        {this.presentHighlights(highlights)}
        {categories.map((category, index) => (
          <Accordion key={index} title={category.title}>
            <div className="TicketResultList-dropdown-content">
              <div className="TicketResultList-group">
                {this.presentTickets(category.tickets)}
              </div>  
            </div>
          </Accordion>
        ))}
      </div>
    );
  }
}
