import React from 'react';
import { connect } from 'react-redux';
import Header from '../ui/Header';
import Footer from '../ui/Footer';
import Button from '../ui/Button';
import { changeScreen } from '../redux/actions';
import content from '../data/review.png';

import './Review.css';

const mapStateToProps = state => {
  console.log(state);
  return {
    results: state.results,
    selection: state.selection,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeScreen: id => dispatch(changeScreen(id)),
  };
};

class Review extends React.Component {
  getPreviousScreenId() {
    const { results } = this.props;

    return results.ReturnJourney ? 4 : 2;
  }

  goToPreviousScreen() {
    const { changeScreen } = this.props;

    changeScreen(this.getPreviousScreenId());
  }

  getNextScreenId() {
    return 6;
  }

  goToNextScreen() {
    const { changeScreen } = this.props;

    changeScreen(this.getNextScreenId());
  }


  render() {
    return (
      <div className="Review">
        <Header title="Review" onBackClick={() => this.goToPreviousScreen()} />
        <div className="Review-content">
          <h2>Your selected journeys and tickets</h2>
        </div>
        <img src={content} className="Review-fakeContent" />
        <Footer>
          <div className="Review-footer">
            <div className="Review-footer-text">
              <div className="Review-footer-text-title">
                Total payment due
              </div>
              <div className="Review-footer-text-amount">
                £50.17
              </div>
            </div>
            <Button onClick={() => this.goToNextScreen()} text="Go to payment" />
          </div>
        </Footer>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Review);