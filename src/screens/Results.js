import React from 'react';
import JourneyResultList from '../ui/JourneyResultList';
import TicketResultList from '../ui/TicketResultList';
import ResultsHeader from '../ui/ResultsHeader';
import Header from '../ui/Header';
import { connect } from 'react-redux';
import { changeSelectedOutboundJourney, changeSelectedOutboundTicket, changeSelectedInboundJourney, changeSelectedInboundTicket, changeScreen } from '../redux/actions';
import { getStationName } from '../utility/get';
import { earlierInboundServices, earlierOutboundServices, laterOutboundServices, laterInboundServices } from '../redux/actions';
import { getSelectedOutboundService, getSelectedOutboundTicket, getSelectedInboundService, getSelectedInboundTicket } from '../utility/get';

import journeyInfoScreen from '../data/journeyInfo.png';
import termsAndConditionsScreen from '../data/termsAndConditions.png';
import priceBreakdownOverlay from '../data/priceBreakdownModal.png';

import LargeChevron from '../data/icon/large-chevron';
import './Results.css';
import { formatPrice } from '../utility/format';

const getCheapestTicketPrice = tickets => Math.min(...tickets.map(ticket => ticket.price));

const addPricesToServices = services => {
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

  const passengers = search.adults + search.children;

  if (outbound) {
    addPricesToServices(outbound);

    outbound.forEach(service => {
      service.passengers = passengers;
      service.tickets.forEach(ticket => ticket.passengers = passengers);
    });
  }

  if (inbound) {
    addPricesToServices(inbound);

    inbound.forEach(service => {
      service.passengers = passengers;
      service.tickets.forEach(ticket => ticket.passengers = passengers);
    });
    
    const cheapestInboundStandardPrice = Math.min(...inbound.map(service => service.price.standard));
    const cheapestInboundFirstPrice = Math.min(...inbound.map(service => service.price.first));
    
    outbound.forEach(service => {
      if (!service.tickets.some(ticket => ticket.price === service.price.standard && ticket.isReturn)) {
        service.price.standard += cheapestInboundStandardPrice;
      }
      if (!service.tickets.some(ticket => ticket.price === service.price.first && ticket.isReturn)) {
        service.price.first += cheapestInboundFirstPrice;
      } 
      service.tickets.forEach(ticket => {
        ticket.totalPrice = ticket.price + (ticket.isReturn ? 0 : cheapestInboundStandardPrice);
      })
    });
  } else {
    outbound.forEach(service => {
      service.tickets.forEach(ticket => {
        ticket.totalPrice = ticket.price;
      })
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
        outbound: search.outbound.time,
      },
    };

    if (search.ticketType === 1) {
      if (screen === 1 || screen === 2) {
        data.stage = 0;
      } else if (screen === 3 || screen === 4) {
        data.stage = 1;
      }
      data.time.inbound = search.inbound.time;
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
      if (inbound && !selectedOutboundService.tickets.find(ticket => ticket.id === id).isReturn) {
        changeScreen(3);
      } else {
        changeScreen(5);
      }
    };

    return (
      <div className="Results-content">
        <TicketResultList data={data} onClick={onClick} onPriceBreakdownClick={() => this.setState({ priceBreakdown: true })} onConditionsClick={() => this.setState({ termsAndConditions: true })} />
      </div>
    )
  }

  getReturnJourneyContent() {
    const { inbound, selectInboundJourney, selectedOutboundTicket, laterInboundServices, earlierInboundServices } = this.props;

    inbound.forEach(service => {
      service.price.standard += selectedOutboundTicket.price;
      service.price.first += selectedOutboundTicket.price;
      service.tickets.forEach(ticket => {
        ticket.totalPrice = ticket.price + selectedOutboundTicket.price;
      })
    });

    return (
      <div className="Results-content-fullwidth">
        {this.getEarlierButton(earlierInboundServices)}
        <JourneyResultList data={inbound} onClick={id => { selectInboundJourney(id); this.goToNextScreen() }} onJourneyInfoClick={() => this.setState({ journeyInfo: true })}/>
        {this.getLaterButton(laterInboundServices)}
      </div>
    );
  }

  getReturnTicketContent() {
    const { inbound, selectInboundTicket, selectedOutboundTicket, selectedInboundService } = this.props;
  
    inbound.forEach(service => {
      service.price.standard += selectedOutboundTicket.price;
      service.price.first += selectedOutboundTicket.price;
      service.tickets.forEach(ticket => {
        ticket.totalPrice = ticket.price + selectedOutboundTicket.price;
      })
    });

    const data = this.getTicketPresentationData(selectedInboundService.tickets);

    return (
      <div className="Results-content">
        <TicketResultList data={data} onClick={id => { selectInboundTicket(id); this.goToNextScreen() }} onPriceBreakdownClick={() => this.setState({ priceBreakdown: true })} onConditionsClick={() => this.setState({ termsAndConditions: true })} />
      </div>
    )
  }

  getHeader() { 
    const { outbound, search } = this.props;

    let data = {};

    if (outbound) {
      data.station = {};
      data.station.origin = search.from;
      data.station.destination = search.to;
      data.ticketType = search.ticketType;
    } else {
      data.title = 'Results';
    }

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

  render() {
    const { journeyInfo, termsAndConditions, priceBreakdown } = this.state;

    return (
      <div className="Results">
        {priceBreakdown && <div className="Results-modal">
          <img src={priceBreakdownOverlay} onClick={() => this.setState({ priceBreakdown: false })}/>
        </div>}
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
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Results);
