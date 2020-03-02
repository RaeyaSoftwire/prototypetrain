import React from 'react';
import Header from '../ui/Header';
import { changeScreen, changeSelectedOutboundTicket, changeSelectedInboundTicket } from '../redux/actions';
import reviewFooter from '../data/review-footer.png';
import reviewScreen from '../data/review.png';

import './ReviewThree.css';
import { getChangesString, getDurationString, getSelectedOutboundTicket, getSelectedOutboundService, getSelectedInboundService, getSelectedInboundTicket } from '../utility/get';
import Block from '../ui/Block';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  const { results, selection, search } = state;

  const outboundService = getSelectedOutboundService(results, selection);
  const outboundTicket = getSelectedOutboundTicket(results, selection);
  const inboundService = getSelectedInboundService(results, selection);
  const inboundTicket = getSelectedInboundTicket(results, selection);

  return {
    results,
    search,
    selection,
    outboundService,
    outboundTicket,
    inboundService,
    inboundTicket,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeScreen: id => dispatch(changeScreen(id)),
    selectOutboundTicket: id => dispatch(changeSelectedOutboundTicket(id)),
    selectInboundTicket: id => dispatch(changeSelectedInboundTicket(id)),
  };
};

class ReviewThree extends React.Component {
  getPreviousScreenId() {
    return 3;
  }

  goToPreviousScreen() {
    const { changeScreen, selectOutboundTicket, selectInboundTicket } = this.props;

    selectOutboundTicket(null);
    selectInboundTicket(null);
    changeScreen(this.getPreviousScreenId());
  }

  getNextScreenId() {
    return 6;
  }

  goToNextScreen() {
    const { changeScreen } = this.props;

    changeScreen(this.getNextScreenId());
  }

  presentService(service, ticket) {
    if (!service || !ticket) {
      return null;
    }

    return (
      <Block className="ReviewThree-service">
        <div className="ReviewThree-service-name">
          {service.station.origin} - {service.station.destination}
        </div>
        <div className="ReviewThree-service-date">
          {service.time.departure.format('ddd D MMM')}
        </div>
        <div className="ReviewThree-service-time">
          {service.time.departure.format('HH:mm')} > {service.time.arrival.format('HH:mm')}
        </div>
        <div className="ReviewThree-service-meta">
          {getDurationString(service.time.departure, service.time.arrival)}, {getChangesString(service.changes)}
        </div>
        <div className="ReviewThree-service-tickets">
          <div className="ReviewThree-service-tickets-label">
            Tickets
          </div>
          <div className="ReviewThree-service-tickets-name">
            {ticket.name}
          </div>
        </div>
        <div className="ReviewThree-actions">
          <div className="ReviewThree-action">
            Journey info
          </div>
          <div className="ReviewThree-action">
            Ticket conditions
          </div>
        </div>
      </Block>
    );
  }

  presentSeatGroupRowItem(title, value) {
    return (
      <div className="ReviewThree-seats-group-row-item">
        <div className="ReviewThree-seats-group-row-item-title">
          {title}
        </div>
        <div className="ReviewThree-seats-group-row-item-value">
          {value}
        </div>
      </div>
    );
  }

  presentSeatGroup(service) {
    if (!service) {
      return null;
    }

    const coaches = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seats = [...new Array(64).keys()].map(seat => seat + 1);

    const selectedCoach = coaches[Math.floor(Math.random() * coaches.length)];
    const selectedSeats = [...new Array(service.passengers).keys()].map(() => seats[Math.floor(Math.random() * seats.length)]).sort();

    return (
      <Block className="ReviewThree-seats-group">
        <div className="ReviewThree-seats-group-name">
          {service.station.origin} - {service.station.destination}
        </div>
        <div className="ReviewThree-seats-group-row">
          {this.presentSeatGroupRowItem('Coach', selectedCoach)}
          {selectedSeats.map(seat => this.presentSeatGroupRowItem('Seat', seat))}
          <div className="ReviewThree-seats-group-row-action">
            Change seats
          </div>
        </div>
        <div className="ReviewThree-seats-group-note">
          Non-LNER service: to change seats call 01811 0855
        </div>
      </Block>
    );
  }

  getHeader() { 
    const { search } = this.props;

    const data = {
      station: {
        origin: search.from,
        destination: search.to,
      },
      ticketType: search.ticketType,
    };

    return (
      <Header data={data} onBackClick={() => this.goToPreviousScreen()} />
    );
  }

  render() {
    const { outboundService, outboundTicket, inboundService, inboundTicket } = this.props;

    return (
      <div className="Review">
        {this.getHeader()}
        <div className="ReviewThree-title">
          Review your selection
        </div>
        <div className="ReviewThree-services">
          {this.presentService(outboundService, outboundTicket)}
          {this.presentService(inboundService, inboundTicket)}
        </div>
        <div className="ReviewThree-title">
          Seat reservations
        </div>
        <div className="ReviewThree-seats">
          {this.presentSeatGroup(outboundService)}
          {this.presentSeatGroup(inboundService)}
        </div>
        <img src={reviewScreen} className="ReviewThree-fakeContent" />
        <img src={reviewFooter} className="ReviewThree-fakeContent" onClick={() => this.goToNextScreen()} />
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewThree);