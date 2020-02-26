import React from 'react';
import TicketResult from './TicketResult';
import Accordion from '../ui/Accordion';

import './TicketResultList.css';

export default class TicketResultList extends React.Component {
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
    
    const highlightHasDiscount = highlights.some(highlight => highlight.ticket.isDiscounted);
    const categoriesHaveDiscount = categories.some(category => category.tickets.some(ticket => ticket.isDiscounted));
    const isSomeDiscount = highlightHasDiscount || categoriesHaveDiscount;

    return (
      <div className="TicketResultList">
        {isSomeDiscount && <div className="TicketResultList-discountMessage">
          Some of these tickets are discounted — check the price breakdown for more information.
        </div>}
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
