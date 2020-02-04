import { CHANGE_SCREEN } from '../actionTypes';

const initialState = {
  screen: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_SCREEN: {
      const screen = action.payload;
      return {
        ...state,
        screen: screen,
      };
    }
    default:
      return state;
  }
}

export default reducer;