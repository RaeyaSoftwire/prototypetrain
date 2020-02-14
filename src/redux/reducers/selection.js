import { CHANGE_SELECTED_OUTBOUND_JOURNEY, CHANGE_SELECTED_OUTBOUND_TICKET, CHANGE_SELECTED_INBOUND_JOURNEY, CHANGE_SELECTED_INBOUND_TICKET } from '../actionTypes';

const initialState = {
  outboundJourney: null,
  outboundTicket: null,
  inboundJourney: null,
  inboundTicket: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_SELECTED_OUTBOUND_JOURNEY: {
      return {
        ...state,
        outboundJourney: action.id,
      };
    }
    case CHANGE_SELECTED_OUTBOUND_TICKET: {
      return {
        ...state,
        outboundTicket: action.id,
      };
    }
    case CHANGE_SELECTED_INBOUND_JOURNEY: {
      return {
        ...state,
        inboundJourney: action.id,
      };
    }
    case CHANGE_SELECTED_INBOUND_TICKET: {
      return {
        ...state,
        inboundTicket: action.id,
      };
    }
    default:
      return state;
  }
}

export default reducer;