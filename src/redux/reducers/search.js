import { CHANGE_SEARCH_DATA } from '../actionTypes';
import moment from 'moment';

// qq Move this to update when we go to the search form

const nextTime = moment().add(15, 'minutes').add(20, 'days');
    
// Round up to nearest 5 minutes
const remainder = 5 - (nextTime.minutes() % 5);
nextTime.add(remainder, 'minutes').startOf('minute');

const initialState = {
  searching: false,
  trains: null,
  from: 3457,
  to: 4227,
  ticketType: 0,
  outbound: {
    time: nextTime,
    after: true,
  },
  inbound: {
    time: nextTime.clone().add(1, 'day'),
    after: true,
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_SEARCH_DATA: {
      const change = action.payload;
      return {
        ...state,
        ...change,
      };
    }
    default:
      return state;
  }
}

export default reducer;