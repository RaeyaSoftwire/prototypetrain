import React from 'react';
import stations from '../data/stations.json';
import SingleIcon from '../data/icon/single';
import ReturnIcon from '../data/icon/return';
import OpenReturnIcon from '../data/icon/open-return';
import SeasonIcon from '../data/icon/season';
import Header from '../ui/Header';

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

export const getDurationString = (departure, arrival) => {
  if (!departure || !arrival) {
    return null;
  }

  const duration = arrival.diff(departure, 'minutes');

  const hours = Math.floor(duration / 60).toFixed(0);
  const minutes = (duration % 60).toFixed(0).padStart(2, '0');

  if (hours === '0') {
    return `${minutes}m`;
  } else {
    return `${hours}h ${minutes}m`;
  }
};

export const getChangesString = changes => {
  return `${changes} changes`;
}

export const getTicketTypeIcon = (id, className) => {
  switch (id) {
    case 0:
      return <SingleIcon className={className} />
    case 1:
      return <ReturnIcon className={className} />
    case 2:
      return <OpenReturnIcon className={className} />
    case 3:
      return <SeasonIcon className={className} />
    default:
      return null;
  }
};
