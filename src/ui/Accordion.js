import React from 'react';
import LargeChevron from '../data/icon/large-chevron';

import './Accordion.css';

export default class Accordion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };

    this.toggleOpen = this.toggleOpen.bind(this);
  }

  toggleOpen() {
    this.setState({
      open: !this.state.open,
    });
  }

  render() {
    const { className, children, title, value } = this.props;

    return (
      <div className={`Accordion ${className}`} onClick={this.toggleOpen}>
        <div className="Accordion-control">
          <div className="Accordion-control-left">
            <div className="Accordion-control-title">
              {title}
            </div>
            <div className="Accordion-control-value">
              {value}
            </div>
          </div>
          <LargeChevron className={`Accordion-chevron ${this.state.open ? 'rotated' : ''}`} />
        </div>
        {this.state.open && <div className="Accordion-content">
          {children}
        </div>}
      </div>
    )
  }
}
