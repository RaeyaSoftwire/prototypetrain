import React from 'react';
import JourneyResultList from '../ui/JourneyResultList';
import ResultsHeader from '../ui/ResultsHeader';
import Header from '../ui/Header';
import { connect } from 'react-redux';

import './Results.css';

const mapStateToProps = state => {
  console.log(state.results);
  return {
    results: state.results
  };
};

class Results extends React.Component {
  render() {
    const { OutwardJourney, ReturnJourney } = this.props.results;
    
    return (
      <div className="Results">
        <Header title="Outbound journey" />
        <ResultsHeader title="London Kings Cross to York" subtitle="Fri 31 Jan" />
        <div className="Results-content">
          <div>
            {OutwardJourney && <div>
              <JourneyResultList data={OutwardJourney} />
            </div>}
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

export default connect(
  mapStateToProps,
  null
)(Results);
