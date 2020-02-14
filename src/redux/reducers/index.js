import { combineReducers } from 'redux';
import screen from './screen';
import search from './search';
import selection from './selection';
import results from './results';

export default combineReducers({
  search: search, 
  screen: screen,
  selection: selection,
  results: results,
});
