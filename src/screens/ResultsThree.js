import React from 'react';
import JourneyResultList from '../ui/JourneyResultList';
import HighlightScreen from '../ui/HighlightScreen';
import TicketResultList from '../ui/TicketResultList';
import ResultsHeaderThree from '../ui/ResultsHeaderThree';
import ResultsHeaderThreeMix from '../ui/ResultsHeaderThreeMix';
import Header from '../ui/Header';
import { connect } from 'react-redux';
import { changeSelectedOutboundJourney, changeSelectedOutboundTicket, changeSelectedInboundJourney, changeSelectedInboundTicket, changeScreen } from '../redux/actions';
import { earlierInboundServices, earlierOutboundServices, laterOutboundServices, laterInboundServices } from '../redux/actions';
import { getSelectedOutboundService, getSelectedOutboundTicket, getSelectedInboundService, getSelectedInboundTicket } from '../utility/get';

import journeyInfoScreen from '../data/journeyInfo.png';
import termsAndConditionsScreen from '../data/termsAndConditions.png';

import LargeChevron from '../data/icon/large-chevron';
import './Results.css';
import { formatPrice } from '../utility/format';

const getCheapestTicketPrice = tickets => {
  const cheapest = Math.min(...tickets.map(ticket => ticket.price));
  return cheapest === Infinity ? null : cheapest;
};

const addDataToServices = services => {
  services.forEach(service => {
    if (service.tickets.length > 0) {
      service.price = {
        standard: getCheapestTicketPrice(service.tickets.filter(ticket => !ticket.isFirst)),
        first: getCheapestTicketPrice(service.tickets.filter(ticket => ticket.isFirst)),
      };
    } else {
      service.price = {
        standard: null,
        first: null,
      };
      service.note = 'No tickets available';
    }
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

class ResultsThree extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      journeyInfo: false,
      termsAndConditions: false,
      priceBreakdownOpen: false,
      priceBreakdownOutId: null,
      priceBreakdownInId: null,
    };
  }

  getCheapestForSingle(tickets) {
    const cheapestPrice = Math.min(...tickets.map(ticket => ticket.price));
    const cheapest = tickets.find(ticket => ticket.price === cheapestPrice);

    if (!cheapest) return null;

    return {
      idOut: cheapest.id,
      idIn: null,
      descriptionLines: [
        cheapest.name,
      ],
      price: cheapestPrice,
      isDiscounted: cheapest.isDiscounted,
      passengers: cheapest.passengers,
    };
  }

  getCheapestForReturn(outTickets, inTickets) {
    const twoLegTickets = outTickets.filter(ticket => ticket.isReturn);
    const outLegTickets = outTickets.filter(ticket => !ticket.isReturn);
    const inLegTickets = inTickets;

    const cheapestOutPrice = Math.min(...outLegTickets.map(ticket => ticket.price));
    const cheapestInPrice = Math.min(...inLegTickets.map(ticket => ticket.price));
    const cheapestTwoLegPrice = Math.min(...twoLegTickets.map(ticket => ticket.price));

    if (cheapestOutPrice + cheapestInPrice < cheapestTwoLegPrice) {
      // Two tickets are cheaper than one
      const cheapestOut = outLegTickets.find(ticket => ticket.price === cheapestOutPrice);
      const cheapestIn = inLegTickets.find(ticket => ticket.price === cheapestInPrice);

      if (!cheapestOut || !cheapestIn) return null;

      return {
        idOut: cheapestOut.id,
        idIn: cheapestIn.id,
        descriptionLines: [
          `Outbound: ${cheapestOut.name}`,
          `Inbound: ${cheapestIn.name}`,
        ],
        price: cheapestOutPrice + cheapestInPrice,
        isDiscounted: cheapestOut.isDiscounted || cheapestIn.isDiscounted,
        passengers: cheapestOut.passengers,
      };
    } else {
      // One ticket is cheaper than two
      const cheapestTwoLeg = twoLegTickets.find(ticket => ticket.price === cheapestTwoLegPrice);

      if (!cheapestTwoLeg) return null;

      return {
        idOut: cheapestTwoLeg.id,
        idIn: null,
        descriptionLines: [
          cheapestTwoLeg.name,
        ],
        price: cheapestTwoLeg.price,
        isDiscounted: cheapestTwoLeg.isDiscounted,
        passengers: cheapestTwoLeg.passengers,
      };
    }
  }

  getTicketHighlightsData() {
    const { search, selectedOutboundService, selectedInboundService } = this.props;

    let cheapest;
    let cheapestFirst;
    let cheapestFlexible;
    let bestValue; //... difficult

    if (search.ticketType === 0 || search.ticketType === 2) {
      cheapest = this.getCheapestForSingle(selectedOutboundService.tickets);
      cheapestFirst = this.getCheapestForSingle(selectedOutboundService.tickets.filter(ticket => ticket.isFirst));
      cheapestFlexible = this.getCheapestForSingle(selectedOutboundService.tickets.filter(ticket => ticket.isFlexible));
    }
    
    if (search.ticketType === 1) {
      cheapest = this.getCheapestForReturn(
        selectedOutboundService.tickets,
        selectedInboundService.tickets,
      );
      cheapestFirst = this.getCheapestForReturn(
        selectedOutboundService.tickets.filter(ticket => ticket.isFirst),
        selectedInboundService.tickets.filter(ticket => ticket.isFirst),
      );
      cheapestFlexible = this.getCheapestForReturn(
        selectedOutboundService.tickets.filter(ticket => ticket.isFlexible),
        selectedInboundService.tickets.filter(ticket => ticket.isFlexible),
      );
    }

    let highlights = [];

    const idsAreSame = (dataA, dataB) => dataA && dataB && dataA.idOut === dataB.idOut && dataA.idIn === dataB.idIn;

    if (cheapest) {
      if (search.ticketType === 0) {
        cheapest.title = 'Cheapest ticket';
      } else {
        cheapest.title = 'Cheapest return';
      }
      highlights.push(cheapest);
    }

    if (cheapestFirst && !idsAreSame(cheapestFirst, cheapest)) {
      if (search.ticketType === 0) {
        cheapestFirst.title = 'Cheapest 1st class ticket';
      } else {
        cheapestFirst.title = 'Cheapest 1st class return';
      }
      highlights.push(cheapestFirst);
    }

    if (cheapestFlexible && !idsAreSame(cheapestFlexible, cheapest) && !idsAreSame(cheapestFlexible, cheapestFirst)) {
      if (search.ticketType === 0) {
        cheapestFlexible.title = 'Cheapest flexible ticket';
      } else {
        cheapestFlexible.title = 'Cheapest flexible return';
      }
      highlights.push(cheapestFlexible);
    }

    if (bestValue && !idsAreSame(bestValue, cheapest) && !idsAreSame(bestValue, cheapestFirst) && !idsAreSame(bestValue, cheapestFlexible)) {
      if (search.ticketType === 0) {
        bestValue.title = 'Best value ticket';
      } else {
        bestValue.title = 'Best value return';
      }
      highlights.push(bestValue);
    }

    return {
      highlights,
      categories: [],
    };
  }

  getResultsHeader() { 
    const { search, screen } = this.props;

    let title;
    let subtitle;

    if (screen === 1) {
      if (search.ticketType === 0) {
        title = 'Select service';
      } else {
        title = 'Select outbound service';
      }
      subtitle = search.outbound.time.format('ddd DD MMM');
    } else if (screen === 2) {
      title = 'Select return service';
      subtitle = search.inbound.time.format('ddd DD MMM');
    } else if (screen === 3) {
      title = 'Choose tickets';
    } else if (screen === 10) {
      if (search.ticketType === 1) {
        return <ResultsHeaderThreeMix legNumber={0} outboundTime={search.outbound.time.format('ddd DD MMM')} inboundTime={search.inbound.time.format('ddd DD MMM')} />;
      } else {
        title = 'Choose ticket';
      }
    } else if (screen === 11) {
      return <ResultsHeaderThreeMix legNumber={1} outboundTime={search.outbound.time.format('ddd DD MMM')} inboundTime={search.inbound.time.format('ddd DD MMM')} />;
    }

    return <ResultsHeaderThree title={title} subtitle={subtitle} />;
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
    const { outbound, inbound, search, selectOutboundJourney, earlierOutboundServices, laterOutboundServices, changeScreen } = this.props;

    // In return case, adjust prices to be full journey
    if (search.ticketType === 1) {
      // Calculate minima from potential inbound tickets
      const inboundTickets = [].concat(...inbound.map(service => service.tickets));
      const inboundSingles = inboundTickets.filter(ticket => !ticket.isReturn);
      const cheapestInboundLegStandard = Math.min(...inboundSingles.filter(ticket => !ticket.isFirst).map(ticket => ticket.price));
      const cheapestInboundLegFirst = Math.min(...inboundSingles.filter(ticket => ticket.isFirst).map(ticket => ticket.price));
     
      // For each service...
      outbound.forEach(service => {
        const outboundReturns = service.tickets.filter(ticket => ticket.isReturn);
        const cheapestOutboundReturnStandard = Math.min(...outboundReturns.filter(ticket => !ticket.isFirst).map(ticket => ticket.price));
        const cheapestOutboundReturnFirst = Math.min(...outboundReturns.filter(ticket => ticket.isFirst).map(ticket => ticket.price));
        // Consider whether a return is cheaper than two singles
        service.price.standard = Math.min(service.price.standard + cheapestInboundLegStandard, cheapestOutboundReturnStandard);
        service.price.first = Math.min(service.price.first + cheapestInboundLegFirst, cheapestOutboundReturnFirst);
      });
    }

    const onClick = id => {
      selectOutboundJourney(id);
      if (search.ticketType === 1) {
        changeScreen(2);
      } else {
        changeScreen(3);
      }
    };

    return (
      <div className="Results-content-fullwidth">
        {this.getEarlierButton(earlierOutboundServices)}
        <JourneyResultList data={outbound} onClick={onClick} onJourneyInfoClick={() => this.setState({ journeyInfo: true })} />
        {this.getLaterButton(laterOutboundServices)}
      </div>
    )
  }

  getReturnJourneyContent() {
    const { inbound, selectedOutboundService, selectInboundJourney, laterInboundServices, earlierInboundServices, changeScreen } = this.props;

     // Adjust prices based on selected outbound service
    inbound.forEach(service => {
      const outboundReturns = selectedOutboundService.tickets.filter(ticket => ticket.isReturn);
      const cheapestOutboundReturnStandard = Math.min(...outboundReturns.filter(ticket => !ticket.isFirst).map(ticket => ticket.price));
      const cheapestOutboundReturnFirst = Math.min(...outboundReturns.filter(ticket => ticket.isFirst).map(ticket => ticket.price));
      // Consider whether a return is cheaper than two singles
      service.price.standard = Math.min(selectedOutboundService.price.standard + service.price.standard, cheapestOutboundReturnStandard);
      service.price.first = Math.min(selectedOutboundService.price.first + service.price.first, cheapestOutboundReturnFirst);
    });

    return (
      <div className="Results-content-fullwidth">
        {this.getEarlierButton(earlierInboundServices)}
        <JourneyResultList data={inbound} onClick={id => { selectInboundJourney(id); changeScreen(3); }} onJourneyInfoClick={() => this.setState({ journeyInfo: true })}/>
        {this.getLaterButton(laterInboundServices)}
      </div>
    );
  }

  getTicketHighlightsContent() {
    const { selectOutboundTicket, search, selectInboundTicket, changeScreen } = this.props;

    const data = this.getTicketHighlightsData();

    return (
      <div className="Results-content">
        <HighlightScreen ticketType={search.ticketType} data={data} onHighlightClick={(idOut, idIn) => { selectOutboundTicket(idOut); selectInboundTicket(idIn); changeScreen(5); }} onMixClick={() => changeScreen(10)} onPriceBreakdownClick={(idOut, idIn) => this.setState({ priceBreakdownOpen: true, priceBreakdownOutId: idOut, priceBreakdownInId: idIn })} onConditionsClick={() => this.setState({ termsAndConditions: true })} />
      </div>
    )
  }

  getTicketOutboundContent() {
    const { search, selectOutboundTicket, selectedOutboundService, changeScreen } = this.props;

    const data = selectedOutboundService.tickets.map(ticket => (
      {
        id: ticket.id,
        title: ticket.name,
        price: ticket.price,
        descriptionLines: [],
        passengers: ticket.passengers,
        isDiscounted: ticket.isDiscounted,
      }
    ));

    const handleClick = id => {
      console.log(id);
      console.log(data.find(ticket => ticket.id === id))
      selectOutboundTicket(id);
      if (search.ticketType !== 1 || selectedOutboundService.tickets.find(ticket => ticket.id === id).isReturn) {
        changeScreen(5);
      } else {
        changeScreen(11);
      }
    }

    return (
      <div className="Results-content">
        <TicketResultList data={data} onClick={handleClick} onPriceBreakdownClick={id => this.setState({ priceBreakdownOpen: true, priceBreakdownOutId: id })} onConditionsClick={() => this.setState({ termsAndConditions: true })} />
      </div>
    )
  }

  getTicketInboundContent() {
    const { selectedOutboundTicket, selectInboundTicket, selectedInboundService, changeScreen } = this.props;

    const data = selectedInboundService.tickets.map(ticket => (
      {
        id: ticket.id,
        title: ticket.name,
        price: ticket.price,
        descriptionLines: [],
        passengers: ticket.passengers,
        isDiscounted: ticket.isDiscounted,
      }
    ));

    const handleClick = id => {
      selectInboundTicket(id);
      changeScreen(5);
    }

    return (
      <div className="Results-content">
        <TicketResultList data={data} onClick={handleClick} onPriceBreakdownClick={id => this.setState({ priceBreakdownOpen: true, priceBreakdownOutId: selectedOutboundTicket.id, priceBreakdownInId: id })} onConditionsClick={() => this.setState({ termsAndConditions: true })} />
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
    const { screen, search, selectOutboundJourney, selectInboundJourney } = this.props;

    switch (screen) {
      case 1:
        return 0;
      case 2:
        selectOutboundJourney(null);
        return 1;
      case 3:
        if (search.ticketType === 1) {
          selectInboundJourney(null);
          return 2;
        } else {
          selectOutboundJourney(null);
          return 1;
        }
      case 10:
        return 3;
      case 11:
        return 10;
      default:
        return screen - 1;
    }
  }

  goToPreviousScreen() {
    const { changeScreen } = this.props;

    changeScreen(this.getPreviousScreenId());
  }

  getContent() {
    const { screen } = this.props;

    switch (screen) {
      case 1:
        return this.getOutboundJourneyContent();
      case 2:
        return this.getReturnJourneyContent();
      case 3:
        return this.getTicketHighlightsContent();
      case 10:
        return this.getTicketOutboundContent();
      case 11:
        return this.getTicketInboundContent();
      default:
        return 'Oh no';
    }
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
    const { priceBreakdownOutId, priceBreakdownInId } = this.state;

    return (
      <div className="PriceBreakdown">
        <div className="PriceBreakdown-header">
          Price breakdown
        </div>
        {priceBreakdownOutId !== null ? this.getPriceBreakdownService(selectedOutboundService, selectedOutboundService.tickets[priceBreakdownOutId]) : null}
        {priceBreakdownInId !== null ? this.getPriceBreakdownService(selectedInboundService, selectedInboundService.tickets[priceBreakdownInId]) : null}
      </div>
    );
  }

  render() {
    const { journeyInfo, termsAndConditions, priceBreakdownOpen } = this.state;

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
          </div>
        </div>
        {priceBreakdownOpen && <div className="Results-modal" onClick={() => this.setState({ priceBreakdownOpen: false, priceBreakdownInId: null, priceBreakdownOutId: null })}>
          {this.getPriceBreakdown()}
        </div>}
      </React.Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResultsThree);
