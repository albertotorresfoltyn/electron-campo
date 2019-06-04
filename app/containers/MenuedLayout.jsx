/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import {withRouter,} from 'react-router-dom';

import {
  Navbar,
  NavbarBrand,
} from 'reactstrap';

class MenuedLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { history } = this.props;
    return (
      <div>
        <Navbar color="dark" light expand="md">
          <NavbarBrand onClick={() => { console.log(history); history.push('/'); }}> reactstrap </NavbarBrand>{' '}
        </Navbar>
        {this.props.children}
      </div>
    );
  }
}

export default withRouter(MenuedLayout);
