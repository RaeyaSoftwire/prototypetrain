import { CHANGE_RESULTS } from '../actionTypes';
import moment from 'moment';

const initialState = {};

const translateJourneyResponse = journey => {
  if (!journey) {
    return null;
  }

  if (!journey.Services) {
    return null;
  }

  return journey.Services.map((service, serviceIndex) => {
    const DisplayFares = service.DisplayFaresFixed.concat(service.DisplayFaresFlexible);

    const tickets = DisplayFares
      .filter(fare => fare.Available)
      .map((fare, fareIndex) => {
        return {
          id: fareIndex,
          isDiscounted: fare.IsDiscounted,
          isReturn: fare.IsReturn,
          isFirst: fare.TicketClass === 'First',
          isFlexible: fare.IsFlexible,
          name: fare.DisplayName,
          price: fare.TotalPrice,
          description: `${fare.RouteRestrictionDisplayName} ${fare.ShortTermsLabel}.`,
        };
      });

    // Add a discount the FIRST result
    if (serviceIndex === 0 && tickets) {
      tickets[0].isDiscounted = true;
    }

    return {
      id: serviceIndex,
      time: {
        departure: moment(service.DepartureDateTime),
        arrival: moment(service.ArrivalDateTime),
      },
      changes: service.Changes,
      toc: service.PrimaryTocId,
      tickets,
    };
  });
};

const translateApiResponse = response => {
  return {
    outbound: translateJourneyResponse(response.OutwardJourney),
    inbound: translateJourneyResponse(response.ReturnJourney),
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_RESULTS: {
      return translateApiResponse(action.data);
    }
    default:
      return state;
  }
};

export default reducer;