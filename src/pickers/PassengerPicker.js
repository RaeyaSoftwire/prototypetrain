import React from 'react';

import './PassengerPicker.css';

export default class PassengerPicker extends React.Component {
  render() {    
    const { selected, maxOption, onChange } = this.props;

    const passengerDropdownOptions = [...Array(maxOption+1).keys()]
      .map(n => ({
        key: n,
        value: n,
        text: n.toString(),
      }));
    
    return (
      <select className="PassengerPicker" value={selected} onChange={e => onChange(e.target.value)}>
        {passengerDropdownOptions.map(option => (
          <option key={option.key} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>
    );
  }
}
