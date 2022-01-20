import React from "react";

import { Link } from "react-router-dom";
import useMediaQuery from "../utils/useMediaQuery";

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

function Menu() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  function LinksList({ isDesktop }) {
    if (isDesktop)
      return (
        <div
          className="nav navbar-nav text-light d-flex justify-content-around flex-row "
          id="accordionSidebar"
        >
          <div className="nav-item  p-2">
            <Link className="nav-link " to="/dashboard">
              <span className="oi oi-dashboard" />
              &nbsp;Dashboard
            </Link>
          </div>
          <div className="nav-item p-2">
            <Link className="nav-link " to="/search">
              <span className="oi oi-magnifying-glass" />
              &nbsp;Search
            </Link>
          </div>
          <div className="nav-item p-2">
            <Link className="nav-link " to="/reservations/new">
              <span className="oi oi-plus" />
              &nbsp;New Reservation
            </Link>
          </div>
          <div className="nav-item p-2">
            <Link className="nav-link " to="/tables/new">
              <span className="oi oi-layers" />
              &nbsp;New Table
            </Link>
          </div>
        </div>
      );

    return (
      <div
        className="nav navbar-nav text-light d-flex justify-content-around flex-row "
        id="accordionSidebar"
      >
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <span className="oi oi-menu" />
          </button>
          <div
            className="dropdown-menu dropdown-menu-right"
            aria-labelledby="dropdownMenuButton"
          >
            <a className="dropdown-item" href="/dashboard">
              Dashboard
            </a>
            <a className="dropdown-item" href="/reservations/new">
              New Reservation
            </a>
            <a className="dropdown-item" href="/tables/new">
              New Table
            </a>
          </div>
        </div>
      </div>

      // <div
      //   className="nav navbar-nav text-light d-flex justify-content-around flex-row "
      //   id="accordionSidebar"
      // >
      //   <div className="nav-item  p-2">
      //     <Link className="nav-link " to="/dashboard">
      //       <span className="oi oi-dashboard" />
      //     </Link>
      //   </div>
      //   <div className="nav-item p-2">
      //     <Link className="nav-link " to="/search">
      //       <span className="oi oi-magnifying-glass" />
      //     </Link>
      //   </div>
      //   <div className="nav-item p-2">
      //     <Link className="nav-link " to="/reservations/new">
      //       <span className="oi oi-plus" />
      //     </Link>
      //   </div>
      //   <div className="nav-item p-2">
      //     <Link className="nav-link " to="/tables/new">
      //       <span className="oi oi-layers" />
      //     </Link>
      //   </div>
      // </div>
    );
  }

  return (
    <nav className="navbar navbar-dark align-items-start p-0">
      <div className="container-fluid d-flex flex-row p-0">
        <Link
          className="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0"
          to="/"
        >
          <div className="sidebar-brand-text mx-3">
            <span>Periodic Tables</span>
          </div>
        </Link>
        <hr className="sidebar-divider my-0" />

        <LinksList isDesktop={isDesktop} />
        <div className="text-center d-none d-md-inline">
          <button
            className="btn rounded-circle border-0"
            id="sidebarToggle"
            type="button"
          />
        </div>
      </div>
    </nav>
  );
}

export default Menu;
