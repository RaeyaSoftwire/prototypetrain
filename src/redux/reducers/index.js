import { combineReducers } from 'redux';
import screens from './screens';
import search from './search';
import results from './results';

export default combineReducers({
  search: search, 
  screens: screens,
  results: results,
});
