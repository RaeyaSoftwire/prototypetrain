import React from 'react';
import { Form } from 'semantic-ui-react';
import stations from '../data/stations';

import './StationPicker.css';

const options = stations
  .filter(station => station.name && station.crs)
  .filter(station => station.name.toLowerCase().includes('london') || station.name === 'Leeds' || station.name === 'Harrogate' || station.name === 'York')
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
    return option.name.toLowerCase().includes(termLower) || option.crs.toLowerCase().startsWith(termLower);
  });
};

export default class StationPicker extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {    
    const { selected, onChange } = this.props;

    return (
      <Form.Dropdown className="StationPicker" placeholder='Select a station' defaultValue={selected} search={stationSearchFunction} selection options={options} onChange={onChange} />
    );
  }
}
