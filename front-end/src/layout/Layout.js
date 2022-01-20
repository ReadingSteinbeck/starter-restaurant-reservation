import React from "react";
import Menu from "./Menu";
import Routes from "./Routes";

import useMediaQuery from "../utils/useMediaQuery";

import "./Layout.css";

/**
 * Defines the main layout of the application.
 *
 * You will not need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Layout() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  if (isDesktop)
    return (
      <div className="container-fluid">
        <div className="row h-100">
          <div className="col-12 side-bar">
            <Menu />
          </div>
          <div className="col">
            <Routes />
          </div>
        </div>
      </div>
    );
  return (
    <div className="container-fluid">
      <div className="row h-100">
        <div className="col-12 side-bar">
          <Menu />
        </div>

        <div className="col">
          <Routes />
        </div>
      </div>
    </div>
  );
}

export default Layout;
