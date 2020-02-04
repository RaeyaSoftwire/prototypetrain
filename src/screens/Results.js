import React from 'react';
import { Button } from 'semantic-ui-react';
import JourneyResultList from '../ui/JourneyResultList';
import ResultsHeader from '../ui/ResultsHeader';
import Header from '../ui/Header';

import './Results.css';

export default class Results extends React.Component {
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
      <div className="Results">
        <Header title="Outbound journey" />
        <ResultsHeader title="London Kings Cross to York" subtitle="Fri 31 Jan" />
        <div className="Results-content">
          <div>
            <Button secondary disabled>earlier trains maybe</Button> 
            {OutwardJourney && <div>
              <JourneyResultList data={OutwardJourney} />
            </div>}
            <Button secondary disabled>later trains maybe</Button> 
            {/*ReturnJourney && <div>
              <h3>Return journeys:</h3>
              <TrainFaresTable data={ReturnJourney} />
            </div>*/}
          </div>
        </div>
      </div>
    )
  }
}
