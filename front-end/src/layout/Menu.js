import React from "react";

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

function Menu() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <a className="navbar-brand" href="/">
        <span className="oi oi-dashboard" />
        &nbsp;Periodic Tables
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className=" collapse navbar-collapse " id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item ">
            <a className="nav-link" href="/dashboard">
              <span className="oi oi-dashboard" />
              &nbsp;Dashboard
            </a>
          </li>
          <li className="nav-item ">
            <a className="nav-link" href="/reservations/new">
              <span className="oi oi-plus" />
              &nbsp;New Reservation
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/tables/new">
              <span className="oi oi-layers" />
              &nbsp;New Table
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="/search">
              <span className="oi oi-magnifying-glass" />
              &nbsp;Search
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Menu;
