import { CHANGE_RESULTS } from '../actionTypes';

const initialState = {};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_RESULTS: {
      const results = action.payload;
      return results;
    }
    default:
      return state;
  }
}

export default reducer;