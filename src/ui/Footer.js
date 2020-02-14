import React from 'react';

import './Footer.css';

export default class Footer extends React.Component {
  render() {
    const { children } = this.props;

    return (
      <React.Fragment>
        <div className="Footer">
          {children}
        </div>
        <div className="Footer-padder" />
      </React.Fragment>
    )
  }
}
