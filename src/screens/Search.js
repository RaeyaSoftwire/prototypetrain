import React from 'react';
import { connect } from 'react-redux';
import Header from '../ui/Header';
import TicketTypePicker from '../pickers/TicketTypePicker';
import StationPicker from '../pickers/StationPicker';
import JourneyTimePicker from '../pickers/JourneyTimePicker';
import { changeSearchData, executeSearch } from '../redux/actions';
import PassengerPicker from '../pickers/PassengerPicker';
import Button from '../ui/Button';

import './Search.css';

const mapStateToProps = state => {
  return {
    from: state.search.from,
    to: state.search.to,
    ticketType: state.search.ticketType,
    outbound: state.search.outbound,
    inbound: state.search.inbound,
    searching: state.search.searching,
    adults: state.search.adults,
    children: state.search.children,
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
    const { from, to, ticketType, outbound, inbound, searching, adults, children } = this.props;

    return (
      <div className="Search">
        <Header noBack data={{ title: 'Plan and buy' }} />
        <div className="Search-content">
          <div className="Search-stations">
            <StationPicker selected={from} onChange={(e, { value }) => changeSearchData({ from: value })} />
            <StationPicker selected={to} onChange={(e, { value }) => changeSearchData({ to: value })} />
          </div>
          <div className="Search-ticketType">
            <TicketTypePicker selected={ticketType} onSelect={id => changeSearchData({ ticketType: id })} />
          </div>
          <div className="Search-datetime">
            <h3>Outbound</h3>
            <JourneyTimePicker selected={outbound} onChange={value => changeSearchData({ outbound: value })} />
          </div>
          {ticketType === 1 && <div className="Search-datetime">
            <h3>Return</h3>
            <JourneyTimePicker selected={inbound} onChange={value => changeSearchData({ inbound: value })} />
          </div>}
          <div className="Search-passengers">
            <h3>Passengers</h3>
            <label>Adults</label>
            <PassengerPicker selected={adults} maxOption={8 - children} onChange={value => changeSearchData({ adults: value })} />
            <label>Children</label>
            <PassengerPicker selected={children} maxOption={8 - adults} onChange={value => changeSearchData({ children: value })} />
          </div>
          <Button primary disabled={!this.canSearch()} loading={searching} onClick={executeSearch} text="Search for trains" />
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Search);