import React from 'react';
import JourneyResultList from '../ui/JourneyResultList';
import TicketResultList from '../ui/TicketResultList';
import ResultsHeader from '../ui/ResultsHeader';
import Header from '../ui/Header';
import Footer from '../ui/Footer';
import { connect } from 'react-redux';
import { changeSelectedOutboundJourney, changeSelectedOutboundTicket, changeSelectedInboundJourney, changeSelectedInboundTicket, changeScreen } from '../redux/actions';
import { earlierInboundServices, earlierOutboundServices, laterOutboundServices, laterInboundServices } from '../redux/actions';
import { getSelectedOutboundService, getSelectedOutboundTicket, getSelectedInboundService, getSelectedInboundTicket } from '../utility/get';

import journeyInfoScreen from '../data/journeyInfo.png';
import termsAndConditionsScreen from '../data/termsAndConditions.png';

import LargeChevron from '../data/icon/large-chevron';
import './Results.css';
import { formatPrice } from '../utility/format';

const getCheapestTicketPrice = tickets => Math.min(...tickets.map(ticket => ticket.price));

const addDataToServices = services => {
  services.forEach(service => {
    service.price = {
      standard: getCheapestTicketPrice(service.tickets.filter(ticket => !ticket.isFirst)),
      first: getCheapestTicketPrice(service.tickets.filter(ticket => ticket.isFirst)),
    };
    service.time.duration = service.time.arrival.diff(service.time.departure, 'minutes');
  });
}

const addQualifiers = services => {
  const cheapestServicePrice = Math.min(...services.map(service => Math.min(service.price.standard, service.price.first)));
  const fastestServiceTime = Math.min(...services.map(service => service.time.duration));
  
  services.forEach(service => {
    service.isCheapest = service.price.standard === cheapestServicePrice || service.price.first === cheapestServicePrice;
    service.isFastest = service.time.duration === fastestServiceTime;
  });
}

const mapStateToProps = state => {
  const { search, results } = state;
  const { outbound, inbound } = results;

  const passengers = parseInt(search.adults) + parseInt(search.children);

  if (outbound) {
    addDataToServices(outbound);

    outbound.forEach(service => {
      service.passengers = passengers;
      service.tickets.forEach(ticket => ticket.passengers = passengers);
    });
  }

  if (inbound) {
    addDataToServices(inbound);

    inbound.forEach(service => {
      service.passengers = passengers;
      service.tickets.forEach(ticket => ticket.passengers = passengers);
    });
  }

  if (outbound) {
    addQualifiers(outbound);
  }

  if (inbound) {
    addQualifiers(inbound);
  }

  return {
    results: state.results,
    outbound,
    inbound,
    passengers: search.adults + search.children,
    selectedOutboundService: getSelectedOutboundService(state.results, state.selection),
    selectedOutboundTicket: getSelectedOutboundTicket(state.results, state.selection),
    selectedInboundService: getSelectedInboundService(state.results, state.selection),
    selectedInboundTicket: getSelectedInboundTicket(state.results, state.selection),
    search: state.search,
    screen: state.screen,
    selection: state.selection,
  };
};

const mapDispatchToProps = dispatch => ({
  changeScreen: id => dispatch(changeScreen(id)),
  selectOutboundJourney: id => dispatch(changeSelectedOutboundJourney(id)),
  selectOutboundTicket: id => dispatch(changeSelectedOutboundTicket(id)),
  selectInboundJourney: id => dispatch(changeSelectedInboundJourney(id)),
  selectInboundTicket: id => dispatch(changeSelectedInboundTicket(id)),
  earlierOutboundServices: () => dispatch(earlierOutboundServices()),
  laterOutboundServices: () => dispatch(laterOutboundServices()),
  earlierInboundServices: () => dispatch(earlierInboundServices()),
  laterInboundServices: () => dispatch(laterInboundServices()),
})

class Results extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      journeyInfo: false,
      termsAndConditions: false,
      priceBreakdown: false,
    };
  }

  getTicketPresentationData(tickets) {
    let cheapestJourney = tickets.reduce((result, ticket) => (ticket.price < result.price ? ticket : result));
    let cheapestFirst = tickets.filter(ticket => ticket.isFirst).reduce((result, ticket) => (ticket.price < result.price ? ticket : result));
    let cheapestFlexible = tickets.filter(ticket => ticket.isFlexible).reduce((result, ticket) => (ticket.price < result.price ? ticket : result));

    // Uniqueness
    if (cheapestJourney) {
      if (cheapestFirst) {
        if (cheapestFirst.id === cheapestJourney.id) {
          cheapestFirst = null;
        }  
      }
      if (cheapestFlexible) {
        if (cheapestFlexible.id === cheapestJourney.id || cheapestFlexible.id === cheapestFirst.id) {
          cheapestFlexible = null;
        }  
      }
    }
  
    let highlights = [];

    if (cheapestJourney) {
      highlights.push({
        title: 'Cheapest ticket',
        ticket: cheapestJourney,
      });
    }
    if (cheapestFirst) {
      highlights.push({
        title: 'Cheapest 1st class ticket',
        ticket: cheapestFirst,
      });
    }
    if (cheapestFlexible) {
      highlights.push({
        title: 'Cheapest flexible ticket',
        ticket: cheapestFlexible,
      });
    }
    
    const otherFixed = tickets
      .filter(ticket => !ticket.isFlexible)
      .filter(ticket => !highlights.some(highlight => highlight.ticket.id === ticket.id));

    const otherFlexible = tickets
      .filter(ticket => ticket.isFlexible)
      .filter(ticket => !highlights.some(highlight => highlight.ticket.id === ticket.id));

    const categories = [];

    if (otherFixed.length > 0) {
      categories.push({
        title: `More fixed tickets from ${formatPrice(Math.min(...otherFixed.map(ticket => ticket.price)))}`,
        tickets: otherFixed,
      });
    }

    if (otherFlexible.length > 0) {
      categories.push({
        title: `More flexible tickets from ${formatPrice(Math.min(...otherFlexible.map(ticket => ticket.price)))}`,
        tickets: otherFlexible,
      });
    }

    return {
      highlights,
      categories,
    };
  }

  getResultsHeader() { 
    const { search, screen } = this.props;

    let data = {
      ticketType: search.ticketType,
      time: {
        outbound: search.outbound.time.format('ddd DD MMM'),
      },
    };

    if (search.ticketType === 1) {
      if (screen === 1 || screen === 2) {
        data.stage = 0;
      } else if (screen === 3 || screen === 4) {
        data.stage = 1;
      }
      data.time.inbound = search.inbound.time.format('ddd DD MMM');
    } else if (search.ticketType === 2) {
      if (screen === 1 || screen === 2) {
        data.stage = 0;
      } else if (screen === 3 || screen === 4) {
        data.stage = 1;
      }
      data.time.inbound = 'Open return';
    }

    return <ResultsHeader data={data} />;
  }

  getEarlierButton(onClick) {
    return (
      <div className="Results-earlier" onClick={onClick}>
        <div className="Results-earlier-text">
          Earlier trains
        </div>
        <LargeChevron className="Results-earlier-chevron" />
      </div>
    );
  }

  getLaterButton(onClick) {
    return (
      <div className="Results-later" onClick={onClick}>
        <div className="Results-later-text">
          Later trains
        </div>
        <LargeChevron className="Results-later-chevron" />
      </div>
    );
  }

  getOutboundJourneyContent() {
    const { outbound, selectOutboundJourney, earlierOutboundServices, laterOutboundServices } = this.props;

    return (
      <div className="Results-content-fullwidth">
        {this.getEarlierButton(earlierOutboundServices)}
        <JourneyResultList data={outbound} onClick={id => { selectOutboundJourney(id); this.goToNextScreen() }} onJourneyInfoClick={() => this.setState({ journeyInfo: true })} />
        {this.getLaterButton(laterOutboundServices)}
      </div>
    )
  }

  getOutboundTicketContent() {
    const { selectOutboundTicket, selectedOutboundService, inbound } = this.props;
  
    const data = this.getTicketPresentationData(selectedOutboundService.tickets);

    const onClick = id => {
      const { changeScreen, inbound } = this.props;

      selectOutboundTicket(id);
      // doesnt use selectedOutboundTicket because it wont update before here
      if (inbound && !selectedOutboundService.tickets.find(ticket => ticket.id === id).isReturn) {
        changeScreen(3);
      } else {
        changeScreen(5);
      }
    };

    return (
      <div className="Results-content">
        <TicketResultList data={data} onClick={onClick} onPriceBreakdownClick={id => this.setState({ priceBreakdown: id })} onConditionsClick={() => this.setState({ termsAndConditions: true })} />
      </div>
    )
  }

  getReturnJourneyContent() {
    const { inbound, selectInboundJourney, laterInboundServices, earlierInboundServices } = this.props;

    return (
      <div className="Results-content-fullwidth">
        {this.getEarlierButton(earlierInboundServices)}
        <JourneyResultList data={inbound} onClick={id => { selectInboundJourney(id); this.goToNextScreen() }} onJourneyInfoClick={() => this.setState({ journeyInfo: true })}/>
        {this.getLaterButton(laterInboundServices)}
      </div>
    );
  }

  getReturnTicketContent() {
    const { selectInboundTicket, selectedInboundService } = this.props;

    const data = this.getTicketPresentationData(selectedInboundService.tickets);

    return (
      <div className="Results-content">
        <TicketResultList data={data} onClick={id => { selectInboundTicket(id); this.goToNextScreen() }} onPriceBreakdownClick={id => this.setState({ priceBreakdown: id })} onConditionsClick={() => this.setState({ termsAndConditions: true })} />
      </div>
    )
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

  getPreviousScreenId() {
    const { screen, selectOutboundJourney, selectOutboundTicket, selectInboundJourney } = this.props;

    switch (screen) {
      case 2:
        selectOutboundJourney(null);
      case 3:
        selectOutboundTicket(null);
      case 4:
        selectInboundJourney(null);
    }

    return screen - 1;
  }

  goToPreviousScreen() {
    const { changeScreen } = this.props;

    changeScreen(this.getPreviousScreenId());
  }

  getNextScreenId() {
    const { screen } = this.props;

    switch (screen) {
      // Case 2 is covered in its own fucntion
      case 1:
        return 2;
      case 3:
        return 4;
      case 4:
        return 5;
    }
  }

  goToNextScreen() {
    const { changeScreen } = this.props;

    changeScreen(this.getNextScreenId());
  }

  getContent() {
    const { screen } = this.props;

    switch (screen) {
      case 1:
        return this.getOutboundJourneyContent();
      case 2:
        return this.getOutboundTicketContent();
      case 3:
        return this.getReturnJourneyContent();
      case 4:
        return this.getReturnTicketContent();
      default:
        return 'Oh no';
    }
  }

  getFooter() {
    const { screen, selectedOutboundTicket } = this.props;

    if (screen === 3 || screen === 4) {
      return (
        <Footer>
          <div className="Results-footer">
            <div className="Results-footer-left">
              <b>Outbound</b> {selectedOutboundTicket.name} x{selectedOutboundTicket.passengers}
            </div>
            <div className="Results-footer-right">
              {formatPrice(selectedOutboundTicket.price)}
            </div>
          </div>
        </Footer>
      );
    }

    return null;
  }

  getPriceBreakdownService(service, ticket) {
    if (!service) {
      return null;
    }

    return (
      <div className="PriceBreakdown-service">
        <div className="PriceBreakdown-service-header">
          <div className="PriceBreakdown-service-header-left">
            <div className="PriceBreakdown-service-title">
              {service.station.origin} - {service.station.destination}
            </div>
            <div className="PriceBreakdown-service-subtitle">
              {service.time.departure.format('ddd DD MMM')}, {service.time.departure.format('HH:mm')}-{service.time.arrival.format('HH:mm')}
            </div>
          </div>
          <div className="PriceBreakdown-service-header-right">
            <LargeChevron className="PriceBreakdown-chevron" />
          </div>
        </div>
        <div className="PriceBreakdown-service-ticketName">
          {ticket.name}
        </div>
        <div className="PriceBreakdown-service-row">
          <div className="PriceBreakdown-service-row-quantity">
            {service.passengers}x
          </div>
          <div className="PriceBreakdown-service-row-main">
            Passengers
          </div>
          <div className="PriceBreakdown-service-row-price">
            {ticket.isDiscounted ? formatPrice(ticket.price * 1.2) : formatPrice(ticket.price)}
          </div>
        </div>
        {ticket.isDiscounted && <div className="PriceBreakdown-service-row discount">
          <div className="PriceBreakdown-service-row-main">
            Split ticket discount
          </div>
          <div className="PriceBreakdown-service-row-price">
            {formatPrice(ticket.price * -0.2)}
          </div>
        </div>}
        <div className="PriceBreakdown-service-row total">
          <div className="PriceBreakdown-service-row-main">
            Total
          </div>
          <div className="PriceBreakdown-service-row-price">
            {formatPrice(ticket.price)}
          </div>
        </div>
      </div>
    );
  }

  getPriceBreakdown() {
    const { selectedOutboundService, selectedInboundService, selectedOutboundTicket, selectedInboundTicket, screen } = this.props;
    const { priceBreakdown } = this.state;

    return (
      <div className="PriceBreakdown">
        <div className="PriceBreakdown-header">
          Price breakdown
        </div>
        {this.getPriceBreakdownService(selectedOutboundService, screen < 3 ? selectedOutboundService.tickets[priceBreakdown] : selectedOutboundTicket)}
        {screen >= 3 ? this.getPriceBreakdownService(selectedInboundService, screen < 5 ? selectedInboundService.tickets[priceBreakdown] : selectedInboundTicket) : null}
      </div>
    );
  }

  render() {
    const { journeyInfo, termsAndConditions, priceBreakdown } = this.state;

    return (
      <React.Fragment>
        <div className="Results">
          <div className={`${journeyInfo ? '' : 'hidden'}`}>
            <Header data={{ title: 'Journey information' }} onBackClick={() => this.setState({ journeyInfo: false })} />
            <img src={journeyInfoScreen} className="Results-fakeContent" />
          </div>
          <div className={`${termsAndConditions ? '' : 'hidden'}`}>
            <Header data={{ title: 'Terms and conditions' }} onBackClick={() => this.setState({ termsAndConditions: false })} />
            <img src={termsAndConditionsScreen} className="Results-fakeContent" />
          </div>
          <div className={`${termsAndConditions || journeyInfo ? 'hidden' : ''}`}>
            {this.getHeader()}
            {this.getResultsHeader()}
            {this.getContent()}
            {this.getFooter()}
          </div>
        </div>
        {priceBreakdown !== false && <div className="Results-modal" onClick={() => this.setState({ priceBreakdown: false })}>
          {this.getPriceBreakdown()}
        </div>}
      </React.Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Results);
