import React from 'react';
import JourneyResult from './JourneyResult';

import './JourneyResultList.css';

export default class JourneyResultList extends React.Component {
  render() {
    const { data, onClick, onJourneyInfoClick } = this.props;

    return (
      <div className="JourneyResultList">
        {data.map(item => {
          return (
            <JourneyResult key={item.id} data={item} onClick={() => onClick(item.id)} onJourneyInfoClick={() => onJourneyInfoClick(item.id)} />
          );
        })}
      </div>
    );
  }
}
