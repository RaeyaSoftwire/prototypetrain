import React from 'react';
import TicketResult from './TicketResult';
import LargeChevron from '../data/icon/large-chevron';

import './TicketResultList.css';

export default class TicketResultList extends React.Component {
  presentHighlights(highlights) {  
    const { onHighlightClick, onConditionsClick, onPriceBreakdownClick } = this.props;

    return (
      <div className="TicketResultList-highlights">
        {highlights.map((ticket, index) => (
          <TicketResult className="TicketResultList-ticket" key={index} data={ticket} onClick={() => onHighlightClick(ticket.idOut, ticket.idIn)} onConditionsClick={() => onConditionsClick(ticket.id)} onPriceBreakdownClick={() => onPriceBreakdownClick(ticket.idOut, ticket.idIn)} />
        ))}
      </div>
    )
  }

  render() {
    const { data, onMixClick, ticketType } = this.props;

    const { highlights, categories } = data;
    
    const highlightHasDiscount = highlights.some(ticket => ticket.isDiscounted);
    const categoriesHaveDiscount = categories.some(category => category.tickets.some(ticket => ticket.isDiscounted));
    const isSomeDiscount = highlightHasDiscount || categoriesHaveDiscount;

    return (
      <div className="TicketResultList">
        {isSomeDiscount && <div className="TicketResultList-discountMessage">
          Some of these tickets are discounted — check the price breakdown for more information.
        </div>}
        <div className="TicketResultList-highlight-title">
          Recommended tickets
        </div>
        {this.presentHighlights(highlights)}
        <div className="TicketResultList-mix" onClick={onMixClick}>
          <div className="TicketResultList-mix-title">
            {ticketType === 1 ? 'Mix and match ticket options' : 'More tickets'}
          </div>
          <LargeChevron className="TicketResultList-mix-chevron" />
        </div>
      </div>
    );
  }
}
