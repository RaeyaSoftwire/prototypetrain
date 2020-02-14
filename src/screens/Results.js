import React from 'react';
import JourneyResultList from '../ui/JourneyResultList';
import TicketResultList from '../ui/TicketResultList';
import ResultsHeader from '../ui/ResultsHeader';
import Header from '../ui/Header';
import { connect } from 'react-redux';
import { changeSelectedOutboundJourney, changeSelectedOutboundTicket, changeSelectedInboundJourney, changeSelectedInboundTicket, changeScreen } from '../redux/actions';

import journeyInfoScreen from '../data/journeyInfo.png';
import termsAndConditionsScreen from '../data/termsAndConditions.png';

import './Results.css';

const mapStateToProps = state => {
  return {
    screen: state.screen,
    results: state.results,
    selection: state.selection,
  };
};

const mapDispatchToProps = dispatch => ({
  changeScreen: id => dispatch(changeScreen(id)),
  selectOutboundJourney: id => dispatch(changeSelectedOutboundJourney(id)),
  selectOutboundTicket: id => dispatch(changeSelectedOutboundTicket(id)),
  selectInboundJourney: id => dispatch(changeSelectedInboundJourney(id)),
  selectInboundTicket: id => dispatch(changeSelectedInboundTicket(id)),
})

class Results extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      journeyInfo: false,
      termsAndConditions: false,
    };
  }

  getOutboundJourneyContent() {
    const { results, selectOutboundJourney } = this.props;
  
    return (
      <React.Fragment>
        <ResultsHeader title={`${results.OutwardJourney.Origin.Name} to ${results.OutwardJourney.Destination.Name}`} subtitle={results.OutwardJourney.DisplayDate} />
        <div className="Results-content-fullwidth">
          <JourneyResultList data={results.OutwardJourney} onClick={id => { selectOutboundJourney(id); this.goToNextScreen() }} onJourneyInfoClick={() => this.setState({ journeyInfo: true })} />
        </div>
      </React.Fragment>
    )
  }

  getOutboundTicketContent() {
    const { results, selection, selectOutboundTicket } = this.props;
  
    const service = results.OutwardJourney.Services[selection.outboundJourney];

    return (
      <React.Fragment>
        <ResultsHeader title={`${results.OutwardJourney.Origin.Name} to ${results.OutwardJourney.Destination.Name}`} subtitle={`${results.OutwardJourney.DisplayDate} - ${service.DepartureTimeString} > ${service.ArrivalTimeString}`} />
        <div className="Results-content">
          <TicketResultList data={results.OutwardJourney.Services[selection.outboundJourney]} onClick={id => { selectOutboundTicket(id); this.goToNextScreen() }} onConditionsClick={() => this.setState({ termsAndConditions: true })} />
        </div>
      </React.Fragment>
    )
  }

  getReturnJourneyContent() {
    const { results, selectInboundJourney } = this.props;
  
    return (
      <React.Fragment>
        <ResultsHeader title={`${results.ReturnJourney.Origin.Name} to ${results.ReturnJourney.Destination.Name}`} subtitle={results.ReturnJourney.DisplayDate} />
        <div className="Results-content-fullwidth">
          <JourneyResultList data={results.ReturnJourney} onClick={id => { selectInboundJourney(id); this.goToNextScreen() }} onJourneyInfoClick={() => this.setState({ journeyInfo: true })}/>
        </div>
      </React.Fragment>
    )
  }

  getReturnTicketContent() {
    const { results, selection, selectInboundTicket } = this.props;
  
    return (
      <React.Fragment>
        <div className="Results-content">
          <TicketResultList data={results.ReturnJourney.Services[selection.inboundJourney]} onClick={id => { selectInboundTicket(id); this.goToNextScreen() }} onConditionsClick={() => this.setState({ termsAndConditions: true })} />
        </div>
      </React.Fragment>
    )
  }

  getTitle() { 
    const { screen } = this.props;

    switch (screen) {
      case 1:
        return 'Outbound journey';
      case 2:
        return 'Outbound ticket';
      case 3:
        return 'Return journey';
      case 4:
        return 'Return ticket';
      default:
        return 'Oh no';
    }
  }

  getPreviousScreenId() {
    const { screen } = this.props;
    return screen - 1;
  }

  goToPreviousScreen() {
    const { changeScreen } = this.props;

    changeScreen(this.getPreviousScreenId());
  }

  getNextScreenId() {
    const { screen, results } = this.props;

    switch (screen) {
      case 1:
        return 2;
      case 2:
        if (results.ReturnJourney) {
          return 3;
        }
        return 5;
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
    const { journeyInfo, termsAndConditions } = this.state;

    if (journeyInfo) {
      return (
        <div className="Results">
          <Header title="Journey information" onBackClick={() => this.setState({ journeyInfo: false })} />
          <img src={journeyInfoScreen} className="Results-fakeContent" />
        </div>
      )
    }

    if (termsAndConditions) {
      return (
        <div className="Results">
          <Header title="Terms and conditions" onBackClick={() => this.setState({ termsAndConditions: false })} />
          <img src={termsAndConditionsScreen} className="Results-fakeContent" />
        </div>
      )
    }

    return (
      <div className="Results">
        <Header title={this.getTitle()} onBackClick={() => this.goToPreviousScreen()} />
        {this.getContent()}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Results);
