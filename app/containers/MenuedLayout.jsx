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
<nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
  <div className="container ml-0">

<div className="navbar-brand text-white"    onClick={() => {
              history.goBack();
            }}
          >
            {" "}
            <i className="fas fa-arrow-left"> </i>
  
</div>
    <a className="navbar-brand text-white" >
    <img src="../app/assets/img/Cow_1-128.png" width="40" height="40" alt="" className="logo"/>
     <span className="ml-5">Administración Ganadera</span> </a>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
    <div className="collapse navbar-collapse" id="navbarResponsive">
      <ul className="navbar-nav ml-4">
        <li className="nav-item active">
          <a className="nav-link" href="#"  onClick={() => {
              history.push("/");
            }}>Home 
              </a>
        </li>
      </ul>
    </div>
  </div>
</nav>


        {/* <Navbar className="bg-fulldark text-white shadow" expand="md">
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
        </Navbar> */}

        {this.props.children}
      </div>
    );
  }
}

export default withRouter(MenuedLayout);
