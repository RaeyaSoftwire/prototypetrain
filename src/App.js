import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { Button, Form } from 'semantic-ui-react';
import Results from 'screens/Results';
import TicketTypePicker from './pickers/TicketTypePicker';
import StationPicker from './pickers/StationPicker';
import JourneyTimePicker from './pickers/JourneyTimePicker';
import TrainFares from './TrainFares';
import stations from './data/stations';

import './App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    const nextTime = moment().add(15, 'minutes').add(20, 'days');
    
    // Round up to nearest 5 minutes
    const remainder = 5 - (nextTime.minutes() % 5);
    nextTime.add(remainder, 'minutes').startOf('minute');

    this.state = {
      fetchingTrains: false,
      trains: null,
      fromStation: 3457,
      toStation: 4227,
      ticketType: 0,
      outboundJourney: {
        time: nextTime,
        after: true,
      },
      returnJourney: {
        time: nextTime.clone().add(1, 'day'),
        after: true,
      },
    };

    this.findTrains = this.findTrains.bind(this);
    this.handleFromStationChange = this.handleFromStationChange.bind(this);
    this.handleToStationChange = this.handleToStationChange.bind(this);
    this.handleTicketTypeChange = this.handleTicketTypeChange.bind(this);
    this.handleOutboundJourneyChange = this.handleOutboundJourneyChange.bind(this);
    this.handleReturnJourneyChange = this.handleReturnJourneyChange.bind(this);
  }

  findTrains() {
    this.setState({
      fetchingTrains: true,
    });

    const corsBypassUrl = 'https://cors-anywhere.herokuapp.com/';
    const apiUrl = 'https://www.lner.co.uk/api/CbeService/GetFares';

    axios.get(`${corsBypassUrl}${apiUrl}`, {
      params: {
        ocrs: stations.find(station => station.id === this.state.fromStation).crs,
        dcrs: stations.find(station => station.id === this.state.toStation).crs,
        outy: this.state.outboundJourney.time.format('YYYY'),
        outm: this.state.outboundJourney.time.format('MM'),
        outd: this.state.outboundJourney.time.format('DD'),
        outh: this.state.outboundJourney.time.format('kk'),
        outmi: this.state.outboundJourney.time.format('mm'),
        outda: this.state.outboundJourney.after ? 'y' : 'n',
        ret: (this.state.ticketType === 1 || this.state.ticketType === 2) ? 'y' : 'n',
        rety: this.state.ticketType === 1 ? this.state.returnJourney.time.format('YYYY') : null,
        retm: this.state.ticketType === 1 ? this.state.returnJourney.time.format('MM') : null,
        retd: this.state.ticketType === 1 ? this.state.returnJourney.time.format('DD') : null,
        reth: this.state.ticketType === 1 ? this.state.returnJourney.time.format('kk') : null,
        retmi: this.state.ticketType === 1 ? this.state.returnJourney.time.format('mm') : null,
        retda: this.state.ticketType === 1 ? (this.state.returnJourney.after ? 'y' : 'n') : null,
        nad: 1,
        nch: 0,
      },
    }).then(
      res => this.setState({
        fetchingTrains: false,
        trains: res.data,
      }),
      error => {
        console.log('Tears');
        console.log(error);
      }
    );
  }

  handleFromStationChange(e, { value }) {
    this.setState({
       fromStation: value,
    });
  }

  handleToStationChange(e, { value }) {
    this.setState({
      toStation: value,
    });
  }

  handleTicketTypeChange(e, { value }) {
    this.setState({
      ticketType: value,
    });
  }

  handleOutboundJourneyChange(e, { value }) {
    this.setState({
      outboundJourney: value,
    });
  }

  handleReturnJourneyChange(e, { value }) {
    this.setState({
      returnJourney: value,
    });
  }

  canSearch() {
    const { toStation, fromStation, ticketType, outboundJourney, returnJourney } = this.state;

    return toStation && fromStation && outboundJourney.time && (ticketType !== 1 || returnJourney.time);
  }

  render() {    
    return (
      <div>
        <Results />
        <h1>Search form</h1>
        <Form>
          <Form.Group>
            <Form.Field>
              <label>From:</label>
              <StationPicker selected={this.state.fromStation} onChange={this.handleFromStationChange} />
            </Form.Field>
            <Form.Field>
              <label>To:</label>
              <StationPicker selected={this.state.toStation} onChange={this.handleToStationChange} />
            </Form.Field>
          </Form.Group>
          <Form.Field>
            <label>Ticket type:</label>
            <TicketTypePicker selected={this.state.ticketType} onChange={this.handleTicketTypeChange} />
          </Form.Field>
          <Form.Group>
            <Form.Field>
              <label>Outbound:</label>
              <JourneyTimePicker selected={this.state.outboundJourney} onChange={this.handleOutboundJourneyChange} />
            </Form.Field>
          </Form.Group>
          <Form.Group>
            {this.state.ticketType === 1 && <Form.Field>
              <label>Return:</label>
              <JourneyTimePicker selected={this.state.returnJourney} onChange={this.handleReturnJourneyChange} />
            </Form.Field>}
          </Form.Group>
        </Form>
        <Button primary disabled={!this.canSearch()} loading={this.state.fetchingTrains} onClick={this.findTrains}>Search for trains</Button>
        <TrainFares loading={this.state.fetchingTrains} data={this.state.trains} />
      </div>
    );
  }
}
