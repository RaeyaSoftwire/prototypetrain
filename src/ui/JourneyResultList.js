import React from 'react';
import moment from 'moment';
import JourneyResult from './JourneyResult';

export default class JourneyResultList extends React.Component {
  getMinFare(displayFares, ticketClass) {
    return Math.min(...displayFares
      .filter(displayFare => displayFare.Available)
      .filter(displayFare => displayFare.TicketClass === ticketClass)
      .map(displayFare => displayFare.TotalPrice))
  }

  render() {
    const { data } = this.props;

    const { Services } = data;

    const journeys = Services.map(service => {
      const { ArrivalDateTime, DepartureDateTime, DisplayFaresFixed, DisplayFaresFlexible } = service;
      const DisplayFares = DisplayFaresFixed.concat(DisplayFaresFlexible);

      return {
        departureTime: moment(DepartureDateTime),
        arrivalTime: moment(ArrivalDateTime),
        standardPrice: this.getMinFare(DisplayFares, "Standard"),
        firstPrice: this.getMinFare(DisplayFares, "First"),
      };
    });

    return (
      <div className="JourneyResultList">
        {journeys.map((journey, key) => {
          return (
            <JourneyResult data={journey} />
          );
        })}
      </div>
    );
  }
}
