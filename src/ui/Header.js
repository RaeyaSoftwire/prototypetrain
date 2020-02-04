import React from 'react';

import './Header.css';

export default class Header extends React.Component {
  render() {
    const { title } = this.props;

    return (
      <header className="Header">
        {title}
      </header>
    )
  }
}
