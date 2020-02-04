import React from 'react';
import { Form } from 'semantic-ui-react';
import stations from '../data/stations';

const stationDropdownOptions = stations
  .filter(station => station.name && station.crs)
  .map(station => ({
    key: station.id,
    value: station.id,
    text: `${station.name} (${station.crs})`,
    name: station.name,
    crs: station.crs,
}));

const stationSearchFunction = (options, term) => {
  return options.filter(option => {
    const termLower = term.toLowerCase();
    return option.name.toLowerCase().startsWith(termLower) || option.crs.toLowerCase().startsWith(termLower);
  });
};

export default class StationPicker extends React.Component {
  render() {    
    const { selected, onChange } = this.props;

    return (
      <Form.Dropdown placeholder='Select a station' defaultValue={selected} search={stationSearchFunction} selection options={stationDropdownOptions} onChange={onChange} />
    );
  }
}
