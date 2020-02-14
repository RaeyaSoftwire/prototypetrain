import React from 'react';
import moment from 'moment';

import './JourneyTimePicker.css';

const beforeOrAfterOptions = [
  {
    key: 0,
    value: true,
    text: 'Depart after',
  },
  {
    key: 1,
    value: false,
    text: 'Arrive before',
  },
];

const calculateFormValues = input => {
  const after = input.after;

  const timeMoment = moment(input.time);

  return {
    after: after,
    date: timeMoment.format('YYYY-MM-DD'),
    time: timeMoment.format('HH:mm'),
  };
}

const calculateState = formValues => {
  const newstate = {
    after: formValues.after,
    time: moment(`${formValues.date} ${formValues.time}`),
  };
  return newstate;
}

export default class JourneyTimePicker extends React.Component {
  constructor(props) {
    super(props);

    this.formValues = calculateFormValues(props.selected);

    this.handleChange = this.handleChange.bind(this);
    this.handleAfterChange = this.handleAfterChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { selected } = nextProps;
    this.formValues = calculateFormValues(selected);
  }

  handleChange(newFormValues) {
    const { onChange } = this.props;

    onChange(calculateState(newFormValues));
  }

  handleAfterChange(e) {
    this.handleChange({ ...this.formValues, after: e.target.value });
  }

  handleDateChange(e) {
    this.handleChange({ ...this.formValues, date: e.target.value });
  }

  handleTimeChange(e) {
    this.handleChange({
      ...this.formValues,
      time: e.target.value,
    });
  }

  render() {    
    return (
      <div className="JourneyTimePicker">
        <select value={this.formValues.after} className="JourneyTimePicker-after" onChange={this.handleAfterChange}>
          {beforeOrAfterOptions.map(option => (
            <option value={option.value} key={option.key}>{option.text}</option>
          ))}
        </select> 
        <input className="JourneyTimePicker-day" type="date" value={this.formValues.date} onChange={this.handleDateChange} />
        <input className="JourneyTimePicker-time" type="time" value={this.formValues.time} onChange={this.handleTimeChange} />
      </div>
    );
  }
}
