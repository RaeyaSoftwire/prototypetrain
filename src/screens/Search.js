import React from 'react';
import { connect } from 'react-redux';
import { Button, Form } from 'semantic-ui-react';
import Header from '../ui/Header';
import TicketTypePicker from '../pickers/TicketTypePicker';
import StationPicker from '../pickers/StationPicker';
import JourneyTimePicker from '../pickers/JourneyTimePicker';

import './Search.css';
import { changeSearchData, executeSearch } from '../redux/actions';

const mapStateToProps = state => {
  return {
    from: state.search.from,
    to: state.search.to,
    ticketType: state.search.ticketType,
    outbound: state.search.outbound,
    inbound: state.search.inbound,
    searching: state.search.searching,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeSearchData: change => dispatch(changeSearchData(change)),
    executeSearch: () => dispatch(executeSearch()),
  };
}

class Search extends React.Component {
  canSearch() {
    const { to, from, ticketType, outbound, inbound } = this.props;

    return to && from && outbound.time && (ticketType !== 1 || inbound.time);
  }

  render() {
    const { changeSearchData, executeSearch } = this.props;
    const { from, to, ticketType, outbound, inbound, searching } = this.props;

    return (
      <div className="Search">
        <Header title="Plan and buy" />
        <div className="Search-content">
          <Form>
            <Form.Group>
              <Form.Field>
                <label>From:</label>
                <StationPicker selected={from} onChange={(e, { value }) => changeSearchData({ from: value })} />
              </Form.Field>
              <Form.Field>
                <label>To:</label>
                <StationPicker selected={to} onChange={(e, { value }) => changeSearchData({ to: value })} />
              </Form.Field>
            </Form.Group>
            <Form.Field>
              <label>Ticket type:</label>
              <TicketTypePicker selected={ticketType} onChange={(e, { value }) => changeSearchData({ ticketType: value })} />
            </Form.Field>
            <Form.Group>
              <Form.Field>
                <label>Outbound:</label>
                <JourneyTimePicker selected={outbound} onChange={(e, { value }) => changeSearchData({ outbound: value })} />
              </Form.Field>
            </Form.Group>
            <Form.Group>
              {ticketType === 1 && <Form.Field>
                <label>Return:</label>
                <JourneyTimePicker selected={inbound} onChange={(e, { value }) => changeSearchData({ inbound: value })} />
              </Form.Field>}
            </Form.Group>
          </Form>
          <Button primary disabled={!this.canSearch()} loading={searching} onClick={() => executeSearch()}>Search for trains</Button>
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Search);