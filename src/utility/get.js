import stations from '../data/stations.json';

export const getStationName = id => {
  return stations.find(station => station.id === id).name;
};

export const getSelectedOutboundService = (results, selection) => {
  if (results.outbound) {
    return results.outbound.find(service => service.id === selection.outboundJourney);
  }

  return null;
};

export const getSelectedOutboundTicket = (results, selection) => {
  const selectedOutboundService = getSelectedOutboundService(results, selection);

  if (selectedOutboundService) {
    return selectedOutboundService.tickets.find(ticket => ticket.id === selection.outboundTicket);
  }

  return null;
};

export const getSelectedInboundService = (results, selection) => {
  if (results.inbound) {
    return results.inbound.find(service => service.id === selection.inboundJourney);
  }

  return null;
};

export const getSelectedInboundTicket = (results, selection) => {
  const selectedInboundService = getSelectedInboundService(results, selection);

  if (selectedInboundService) {
    return selectedInboundService.tickets.find(ticket => ticket.id === selection.inboundTicket);
  }

  return null;
};