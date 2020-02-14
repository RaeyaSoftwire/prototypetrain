import React from 'react';
import moment from 'moment';
import JourneyResult from './JourneyResult';

import './JourneyResultList.css';

export default class JourneyResultList extends React.Component {
  getMinFare(displayFares, ticketClass) {
    return Math.min(...displayFares
      .filter(displayFare => displayFare.Available)
      .filter(displayFare => displayFare.TicketClass === ticketClass)
      .map(displayFare => displayFare.TotalPrice))
  }

  getAnyTicketDiscounted(displayFares) {
    return displayFares.some(displayFare => displayFare.isDiscounted);
  }

  render() {
    const { data, onClick, onJourneyInfoClick } = this.props;

    const { Services } = data;

    const journeysData = Services.map(service => {
      const { ArrivalDateTime, Changes, DepartureDateTime, DisplayFaresFixed, DisplayFaresFlexible, IsCheapest } = service;
      const DisplayFares = DisplayFaresFixed.concat(DisplayFaresFlexible);

      return {
        departureTime: moment(DepartureDateTime),
        arrivalTime: moment(ArrivalDateTime),
        changes: Changes,
        standardPrice: this.getMinFare(DisplayFares, "Standard"),
        firstPrice: this.getMinFare(DisplayFares, "First"),
        isDiscounted: this.getAnyTicketDiscounted(DisplayFares),
      };
    });

    const cheapestPrice = Math.min(...journeysData.map(journey => Math.min(journey.standardPrice, journey.firstPrice)));
    const fastestTime = Math.min(...journeysData.map(journey => journey.arrivalTime.diff(journey.departureTime)));
    
    const journeys = journeysData.map(journey => {
      return {
        ...journey,
        isCheapest: journey.firstPrice === cheapestPrice || journey.standardPrice === cheapestPrice,
        isFastest: journey.arrivalTime.diff(journey.departureTime) === fastestTime,
      };
    });

    return (
      <div className="JourneyResultList">
        {journeys.map((journey, index) => {
          return (
            <JourneyResult key={index} data={journey} onClick={() => onClick(index)} onJourneyInfoClick={() => onJourneyInfoClick(index)} />
          );
        })}
      </div>
    );
  }
}
