import React from 'react';
import { Form } from 'semantic-ui-react';
import ticketTypes from '../data/ticketTypes';

export default class TicketTypePicker extends React.Component {
  render() {
    const { selected, onChange } = this.props;

    return ticketTypes.map(ticketType => <Form.Radio key={ticketType.id} label={ticketType.name} value={ticketType.id} checked={selected === ticketType.id} onChange={onChange} />);
  }
}
