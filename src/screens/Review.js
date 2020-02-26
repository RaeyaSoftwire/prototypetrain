import React from 'react';
import Header from '../ui/Header';
import { changeScreen, changeSelectedInboundTicket } from '../redux/actions';
import userCases from '../data/userCases';
import reviewFooter from '../data/review-footer.png';

import './Review.css';
import { getChangesString, getDurationString, getSelectedOutboundTicket, getSelectedOutboundService, getSelectedInboundService, getSelectedInboundTicket } from '../utility/get';
import Block from '../ui/Block';
import { connect } from 'react-redux';
import Accordion from '../ui/Accordion';

const mapStateToProps = state => {
  const { results, selection } = state;

  const outboundService = getSelectedOutboundService(results, selection);
  const outboundTicket = getSelectedOutboundTicket(results, selection);
  const inboundService = getSelectedInboundService(results, selection);
  const inboundTicket = getSelectedInboundTicket(results, selection);

  return {
    usercase: userCases.find(uc => uc.id === state.usercase),
    results,
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
    selectInboundTicket: id => dispatch(changeSelectedInboundTicket(id)),
  };
};

class Review extends React.Component {
  getPreviousScreenId() {
    const { results, selection } = this.props;

    const hasSelectedReturn = getSelectedOutboundTicket(results, selection).isReturn;

    return (!hasSelectedReturn && results.inbound) ? 4 : 2;
  }

  goToPreviousScreen() {
    const { changeScreen, selectInboundTicket } = this.props;

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
      <Block className="Review-service">
        <div className="Review-service-name">
          {service.station.origin} > {service.station.destination}
        </div>
        <div className="Review-service-date">
          {service.time.departure.format('ddd D MMM')}
        </div>
        <div className="Review-service-time">
          {service.time.departure.format('HH:mm')} > {service.time.arrival.format('HH:mm')}
        </div>
        <div className="Review-service-meta">
          {getDurationString(service.time.departure, service.time.arrival)}, {getChangesString(service.changes)}
        </div>
        <div className="Review-service-tickets">
          <div className="Review-service-tickets-label">
            Tickets
          </div>
          <div className="Review-service-tickets-name">
            {ticket.name}
          </div>
        </div>
        <div className="Review-actions">
          <div className="Review-action">
            Journey info
          </div>
          <div className="Review-action">
            Ticket conditions
          </div>
        </div>
      </Block>
    );
  }

  presentSeatGroup(service) {
    if (!service) {
      return null;
    }

    return (
      <div className="Review-seats-group">
        <div className="Review-seats-group-name">
          {service.station.origin} > {service.station.destination}
        </div>
        <div className="Review-seats-group-item">
          Coach B, Seat 52
        </div>
        <div className="Review-seats-group-item">
          Coach B, Seat 53
        </div>
      </div>
    );
  }

  render() {
    const { usercase, outboundService, outboundTicket, inboundService, inboundTicket } = this.props;

    return (
      <div className="Review">
        <Header title="Review your choice and options" onBackClick={() => this.goToPreviousScreen()} />
        <div className="Review-title">
          Your journey
        </div>
        <div className="Review-services">
          {this.presentService(outboundService, outboundTicket)}
          {this.presentService(inboundService, inboundTicket)}
        </div>
        <div className="Review-title">
          Seat reservations
        </div>
        <div className="Review-subtitle">
          We picked seats - feel free to change them.
        </div>
        <Block className="Review-seats">
          {this.presentSeatGroup(outboundService)}
          {this.presentSeatGroup(inboundService)}
          <div className="Review-actions">
            <div className="Review-action">
              Change seats
            </div>
          </div>
        </Block>
        <div className="Review-additional">
          <Accordion title="Assisted travel" value="None selected">
            You would be able to specify your assisted travel method here.
          </Accordion>
          <Accordion title="Ticket delivery" value="eTicket">
            You would be able to select your ticket delivery method here.
          </Accordion>
        </div>
        <img src={reviewFooter} className="Review-fakeContent" onClick={() => this.goToNextScreen()} />
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Review);