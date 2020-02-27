import { CHANGE_SEARCH_DATA } from '../actionTypes';
import moment from 'moment';

// qq Move this to update when we go to the search form

const nextTime = moment().add(20, 'minutes');
    
// Round up to nearest 5 minutes
const remainder = 5 - (nextTime.minutes() % 5);
nextTime.add(remainder, 'minutes').startOf('minute');

const initialState = {
  searching: false,
  from: 3599,
  to: 6069,
  ticketType: 0,
  outbound: {
    time: nextTime,
    after: true,
  },
  inbound: {
    time: nextTime.clone().add(1, 'day'),
    after: true,
  },
  adults: 1,
  children: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_SEARCH_DATA: {
      return {
        ...state,
        ...action.data,
      };
    }
    default:
      return state;
  }
}

export default reducer;