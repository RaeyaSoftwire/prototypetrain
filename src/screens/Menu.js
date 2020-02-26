import React from 'react';
import Header from '../ui/Header';
import userCases from '../data/userCases';
import { changeUserCase, changeScreen } from '../redux/actions';
import { connect } from 'react-redux';

import './Menu.css';

const mapDispatchToProps = dispatch => {
  return {
    changeUserCase: id => dispatch(changeUserCase(id)),
    changeScreen: id => dispatch(changeScreen(id)),
  };
};

class Menu extends React.Component {
  selectUserCase(id) {
    const { changeUserCase, changeScreen } = this.props;
    
    changeUserCase(id);
    changeScreen(0);
  }

  render() {
    return (
      <div className="Menu">
        <Header noBack data={{ title: 'Journey menu' }} />
        <div className = "Menu-list">
          {userCases.map(userCase => {
            return (
              <div className="Menu-list-item" onClick={() => this.selectUserCase(userCase.id)}>
                <div className="Menu-list-item-id">
                  {userCase.id}
                </div>
                <div className="Menu-list-item-name">
                  {userCase.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(Menu);