import React from 'react';
import { Form } from 'semantic-ui-react';
import DatePicker from 'react-semantic-ui-datepickers'
import moment from 'moment';

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

const timeHourOptions = [...Array(24).keys()]
  .map(key => ({
    key: key,
    value: key,
    text: (key).toString().padStart(2, '0'),
  }));

const timeMinuteOptions = [...Array(12).keys()]
  .map(key => ({
    key: key * 5,
    value: key * 5,
    text: (key * 5).toString().padStart(2, '0'),
  }));

const calculateFormValues = input => {
  const after = input.after;

  const timeMoment = moment(input.time);

  const dateMoment = timeMoment.clone().startOf('date');
  const date = dateMoment.toDate();
  
  const hour = timeMoment.hour();

  const minuteUnrounded = timeMoment.minute();
  const minuteOver = minuteUnrounded % 5;
  const minute = minuteUnrounded - minuteOver + (5 * (minuteOver > 2.5));
  
  return {
    after: after,
    date: date,
    hour: hour,
    minute: minute,
  };
}

const calculateState = formValues => {
  const newstate = {
    after: formValues.after,
    time: moment(formValues.date).clone().hours(formValues.hour).minutes(formValues.minute),
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
    this.handleHourChange = this.handleHourChange.bind(this);
    this.handleMinuteChange = this.handleMinuteChange.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { selected } = nextProps;
    this.formValues = calculateFormValues(selected);
  }

  handleChange(e, newFormValues) {
    const { onChange } = this.props;

    onChange(e, {
      value: calculateState(newFormValues),
    })
  }

  handleAfterChange(e, { value }) {
    this.handleChange(e, { ...this.formValues, after: value });
  }

  handleDateChange(e, { value }) {
    this.handleChange(e, { ...this.formValues, date: value });
  }

  handleHourChange(e, { value }) {
    this.handleChange(e, { ...this.formValues, hour: value });
  }

  handleMinuteChange(e, { value }) {
    this.handleChange(e, { ...this.formValues, minute: value });
  }

  render() {    
    return (
      <Form.Group>
        <Form.Dropdown defaultValue={this.formValues.after} options={beforeOrAfterOptions} onChange={this.handleAfterChange} />
        <DatePicker value={this.formValues.date} onChange={this.handleDateChange} />
        <Form.Dropdown selection defaultValue={this.formValues.hour} options={timeHourOptions} onChange={this.handleHourChange} />
        <Form.Dropdown selection defaultValue={this.formValues.minute} options={timeMinuteOptions} onChange={this.handleMinuteChange} />
      </Form.Group>
    );
  }
}
