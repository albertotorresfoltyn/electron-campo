/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint flowtype-errors/show-errors: 0 */
import React from "react";
import { withRouter } from "react-router-dom";

import { Navbar, NavbarBrand } from "reactstrap";

class MenuedLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { history } = this.props;
    return (
      <div>
        <Navbar className="bg-fulldark text-white shadow" expand="md">
          <NavbarBrand
            onClick={() => {
              history.push("/");
            }}
          >
            {" "}
            <i className="fas fa-home"> </i>
          </NavbarBrand>{" "}
          <NavbarBrand>
         
              Buenaventura Ñangarekohápe
           
          </NavbarBrand>
          <NavbarBrand
            onClick={() => {
              history.goBack();
            }}
          >
            {" "}
            <i className="fas fa-arrow-left"> </i>
          </NavbarBrand>{" "}
        </Navbar>

        {this.props.children}
      </div>
    );
  }
}

export default withRouter(MenuedLayout);
