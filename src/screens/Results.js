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
  const { outbound, inbound } = state.results;
  const { search } = state;

  if (outbound) {
    addPricesToServices(outbound);
    
    if (search.ticketType === 0) {
      outbound.forEach(service => {
        service.priceLabel = 'From';
      });
    }
    else if (search.ticketType === 2) {
      outbound.forEach(service => {
        service.priceLabel = 'Return from';
      });
    }
  }

  if (inbound) {
    addPricesToServices(inbound);

    const cheapestInboundStandardPrice = Math.min(...inbound.map(service => service.price.standard));
    const cheapestInboundFirstPrice = Math.min(...inbound.map(service => service.price.first));
    
    outbound.forEach(service => {
      service.priceLabel = 'Return from';
      if (!service.tickets.some(ticket => ticket.price === service.price.standard && ticket.isReturn)) {
        service.price.standard += cheapestInboundStandardPrice;
      }
      if (!service.tickets.some(ticket => ticket.price === service.price.first && ticket.isReturn)) {
        service.price.first += cheapestInboundFirstPrice;
      } 
      service.tickets.forEach(ticket => {
        ticket.totalPrice = ticket.price + (ticket.isReturn ? 0 : cheapestInboundStandardPrice);
        ticket.priceLabel = 'Return from';
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
    if (cheapestFirst.id === cheapestJourney.id) {
      cheapestFirst = null;
    }
    if (cheapestFlexible.id === cheapestJourney.id || cheapestFlexible.id === cheapestFirst.id) {
      cheapestFlexible = null;
    }

    // Badge text assignment
    if (cheapestJourney) {
      cheapestJourney.badgeText = 'Cheapest journey';
    }
    if (cheapestFirst) {
      cheapestFirst.badgeText = 'Cheapest 1st class';
    }
    if (cheapestFlexible) {
      cheapestFlexible.badgeText = 'Cheapest flexible';
    }

    const highlights = [cheapestJourney, cheapestFirst, cheapestFlexible].filter(item => !!item);
    
    const otherFixed = tickets
      .filter(ticket => !ticket.isFlexible)
      .filter(ticket => !highlights.some(highlight => highlight.id === ticket.id));

    const otherFlexible = tickets
      .filter(ticket => ticket.isFlexible)
      .filter(ticket => !highlights.some(highlight => highlight.id === ticket.id));

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
    const { screen, search, outbound, inbound } = this.props;

    const originName = getStationName(search.from);
    const destinationName = getStationName(search.to);
    
    let subtitle = '';
    let priceInfo = null;
    let title = '';

    if (screen === 1 || screen === 2) {
      title = `${originName} to ${destinationName}`;
      subtitle += search.outbound.time.format('ddd D MMM');
    } else if (screen === 3 || screen === 4) {
      title = `${destinationName} to ${originName}`;
      subtitle += search.inbound.time.format('ddd D MMM');
    }

    if (screen === 2 || screen === 4) {
      const { selectedOutboundService, selectedInboundService } = this.props;
      const service = screen === 2 ? selectedOutboundService : selectedInboundService;
      const departureTime = service.time.departure.format('HH:mm');
      const arrivalTime = service.time.arrival.format('HH:mm');
      subtitle += `, ${departureTime}-${arrivalTime}`;
    }
    
    if (screen === 1) {
      const minPrice = Math.min(...outbound.map(service => Math.min(service.price.first, service.price.standard)));
      priceInfo = `${(inbound || search.ticketType === 2) ? 'Return from' : 'From'} ${formatPrice(minPrice)}`;
    }

    if (screen === 2) {
      const { selectedOutboundService } = this.props;
      const minPrice = Math.min(selectedOutboundService.price.first, selectedOutboundService.price.standard);
      priceInfo = `${(inbound || search.ticketType === 2) ? 'Return from' : 'From'} ${formatPrice(minPrice)}`;
    }

    if (screen === 3) {
      const { selectedOutboundTicket } = this.props;
      const minPrice = Math.min(...inbound.map(service => Math.min(service.price.first, service.price.standard)));
      priceInfo = `Return from ${formatPrice(minPrice + selectedOutboundTicket.price)}`;
    }

    if (screen === 4) {
      const { selectedInboundService, selectedOutboundTicket } = this.props;
      const minPrice = Math.min(selectedInboundService.price.first, selectedInboundService.price.standard);
      priceInfo = `Return from ${formatPrice(minPrice + selectedOutboundTicket.price)}`;
    }

    return <ResultsHeader title={title} subtitle={subtitle} priceInfo={priceInfo} />;
  }

  getEarlierButton(onClick) {
    return (
      <div className="Results-earlier" onClick={onClick}>
        <div className="Results-earlier-text">
          Earlier trains
        </div>
        <div className="Results-earlier-chevron">
          v
        </div>
      </div>
    );
  }

  getLaterButton(onClick) {
    return (
      <div className="Results-later" onClick={onClick}>
        <div className="Results-later-text">
          Later trains
        </div>
        <div className="Results-later-chevron">
          v
        </div>
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
      service.priceLabel = 'Return from';
      service.price.standard += selectedOutboundTicket.price;
      service.price.first += selectedOutboundTicket.price;
      service.tickets.forEach(ticket => {
        ticket.totalPrice = ticket.price + selectedOutboundTicket.price;
        ticket.priceLabel = 'Return total';
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
      service.priceLabel = 'Return from';
      service.price.standard += selectedOutboundTicket.price;
      service.price.first += selectedOutboundTicket.price;
      service.tickets.forEach(ticket => {
        ticket.totalPrice = ticket.price + selectedOutboundTicket.price;
        ticket.priceLabel = 'Return total';
      })
    });

    const data = this.getTicketPresentationData(selectedInboundService.tickets);

    return (
      <div className="Results-content">
        <TicketResultList data={data} onClick={id => { selectInboundTicket(id); this.goToNextScreen() }} onPriceBreakdownClick={() => this.setState({ priceBreakdown: true })} onConditionsClick={() => this.setState({ termsAndConditions: true })} />
      </div>
    )
  }

  getTitle() { 
    const { screen } = this.props;

    switch (screen) {
      case 1:
        return 'Choose outbound journey';
      case 2:
        return 'Choose an outbound ticket';
      case 3:
        return 'Choose return journey';
      case 4:
        return 'Choose a return ticket';
      default:
        return 'Oh no';
    }
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
    const { screen, inbound, selectedOutboundTicket } = this.props;

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
          <Header title="Journey information" onBackClick={() => this.setState({ journeyInfo: false })} />
          <img src={journeyInfoScreen} className="Results-fakeContent" />
        </div>
        <div className={`${termsAndConditions ? '' : 'hidden'}`}>
          <Header title="Terms and conditions" onBackClick={() => this.setState({ termsAndConditions: false })} />
          <img src={termsAndConditionsScreen} className="Results-fakeContent" />
        </div>
        <div className={`${termsAndConditions || journeyInfo ? 'hidden' : ''}`}>
          <Header title={this.getTitle()} onBackClick={() => this.goToPreviousScreen()} />
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
