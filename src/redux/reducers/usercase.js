import { CHANGE_USER_CASE } from '../actionTypes';

const initialState = null;

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_USER_CASE: {
      return action.id;
    }
    default:
      return state;
  }
}

export default reducer;