import React from 'react';
import { Table } from 'semantic-ui-react';

export default class TrainFaresTable extends React.Component {
  fareDisplay(fares) {
    return fares.map((fare, key) => {
      const { Available, TotalPriceString } = fare;
      if (Available) {
        return <Table.Cell key={key}>{TotalPriceString}</Table.Cell>
      } else {
        return (
          <Table.Cell key={key}>Unavailable</Table.Cell>
        )
      }
    });
  }

  render() {
    const { data } = this.props;

    const { DisplayFaresFixedGroups, DisplayFaresFlexibleGroups, Services } = data;

    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.Cell />
            {DisplayFaresFixedGroups.map(group => <Table.Cell key={group.Id}>{group.FareDisplayName}</Table.Cell>)}
            {DisplayFaresFlexibleGroups.map(group => <Table.Cell key={group.Id}>{group.FareDisplayName}</Table.Cell>)}
          </Table.Row>
          {Services.map((service, key) => {
            const { ArrivalTimeString, DepartureTimeString, DisplayFaresFixed, DisplayFaresFlexible } = service;
            return (
              <Table.Row key={key}>
                <Table.Cell>{DepartureTimeString} > {ArrivalTimeString}</Table.Cell>
                {this.fareDisplay(DisplayFaresFixed)}
                {this.fareDisplay(DisplayFaresFlexible)}
              </Table.Row>
            );
          })}
        </Table.Header>
      </Table>
    );
  }
}
