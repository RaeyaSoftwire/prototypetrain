import { CHANGE_SEARCH_DATA, CHANGE_SCREEN, CHANGE_RESULTS, CHANGE_SELECTED_OUTBOUND_JOURNEY, CHANGE_SELECTED_OUTBOUND_TICKET, CHANGE_SELECTED_INBOUND_JOURNEY, CHANGE_SELECTED_INBOUND_TICKET } from './actionTypes';
import axios from 'axios';
import stations from '../data/stations';

export const changeSearchData = change => ({
  type: CHANGE_SEARCH_DATA,
  data: change,
});

const findTrains = getState => {
  const searchParams = getState().search;

  const corsBypassUrl = 'https://cors-anywhere.herokuapp.com/';
  const apiUrl = 'https://www.lner.co.uk/api/CbeService/GetFares';

  const queryParams = {
    ocrs: stations.find(station => station.id === searchParams.from).crs,
    dcrs: stations.find(station => station.id === searchParams.to).crs,
    outy: searchParams.outbound.time.format('YYYY'),
    outm: searchParams.outbound.time.format('MM'),
    outd: searchParams.outbound.time.format('DD'),
    outh: searchParams.outbound.time.format('kk'),
    outmi: searchParams.outbound.time.format('mm'),
    outda: searchParams.outbound.after ? 'y' : 'n',
    ret: (searchParams.ticketType === 1 || searchParams.ticketType === 2) ? 'y' : 'n',
    rety: searchParams.ticketType === 1 ? searchParams.inbound.time.format('YYYY') : null,
    retm: searchParams.ticketType === 1 ? searchParams.inbound.time.format('MM') : null,
    retd: searchParams.ticketType === 1 ? searchParams.inbound.time.format('DD') : null,
    reth: searchParams.ticketType === 1 ? searchParams.inbound.time.format('kk') : null,
    retmi: searchParams.ticketType === 1 ? searchParams.inbound.time.format('mm') : null,
    retda: searchParams.ticketType === 1 ? (searchParams.inbound.after ? 'y' : 'n') : null,
    nad: searchParams.adults,
    nch: searchParams.children,
  };

  return axios.get(`${corsBypassUrl}${apiUrl}`, { params: queryParams });
};

export const changeScreen = id => ({
  type: CHANGE_SCREEN,
  id: id,
});

export const changeResults = results => ({
  type: CHANGE_RESULTS,
  data: results,
});

export const executeSearch = () => {
  return (dispatch, getState) => {
    dispatch(changeSearchData({ searching: true }));
    return findTrains(getState)
      .then(results => {
        dispatch(changeResults(results.data));
        dispatch(changeSearchData({ searching: false }));
        dispatch(changeScreen(1));
      });
  };
};

export const changeSelectedOutboundJourney = id => ({
  type: CHANGE_SELECTED_OUTBOUND_JOURNEY,
  id: id,
});

export const changeSelectedOutboundTicket = id => ({
  type: CHANGE_SELECTED_OUTBOUND_TICKET,
  id: id,
});

export const changeSelectedInboundJourney = id => ({
  type: CHANGE_SELECTED_INBOUND_JOURNEY,
  id: id,
});

export const changeSelectedInboundTicket = id => ({
  type: CHANGE_SELECTED_INBOUND_TICKET,
  id: id,
});
