import { CHANGE_SCREEN } from '../actionTypes';

const initialState = 0;

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_SCREEN: {
      return action.id;
    }
    default:
      return state;
  }
}

export default reducer;