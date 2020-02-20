import React from 'react';
import { connect } from 'react-redux';
import Header from '../ui/Header';
import { changeScreen } from '../redux/actions';
import userCases from '../data/userCases';
import reviewFooter from '../data/review-footer.png';
import { changeSelectedInboundTicket } from '../redux/actions';

import './Review.css';
import { getSelectedOutboundTicket } from '../utility/get';

const mapStateToProps = state => {
  return {
    usercase: userCases.find(uc => uc.id === state.usercase),
    results: state.results,
    selection: state.selection,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeScreen: id => dispatch(changeScreen(id)),
    selectInboundTicket: id => dispatch(changeSelectedInboundTicket(id)),
  };
};

class Review extends React.Component {
  getPreviousScreenId() {
    const { results, selection } = this.props;

    const hasSelectedReturn = getSelectedOutboundTicket(results, selection).isReturn;

    return (!hasSelectedReturn && results.inbound) ? 4 : 2;
  }

  goToPreviousScreen() {
    const { changeScreen, selectInboundTicket } = this.props;

    selectInboundTicket(null);
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
    const { usercase } = this.props;

    return (
      <div className="Review">
        <Header title="Review your choice and options" onBackClick={() => this.goToPreviousScreen()} />
        <img src={usercase.review} className="Review-fakeContent" />
        <img src={reviewFooter} className="Review-fakeContent" onClick={() => this.goToNextScreen()} />
        {/*<Footer>
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
        </Footer>*/}
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Review);