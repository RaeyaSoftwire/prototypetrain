import React from 'react';

export default class TrainFares extends React.Component {
  render() {
    const { data, loading } = this.props;
    
    if (loading) {
      return (
        <h2>Finding some glorious trains...</h2>
      );
    }

    if (!data) return null;

    const { OutwardJourney, ReturnJourney } = data;

    return (
      <div>
        <h2>Got some trains!</h2>
        {OutwardJourney && <div>
          <h3>Outward journeys:</h3>
          <TrainFaresTable data={OutwardJourney} />
        </div>}
        {ReturnJourney && <div>
          <h3>Return journeys:</h3>
          <TrainFaresTable data={ReturnJourney} />
        </div>}
      </div>
    );
  }
}
