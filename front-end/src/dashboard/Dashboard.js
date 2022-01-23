import React from "react";

import ErrorAlert from "../layout/ErrorAlert";
import ReservationList from "./ReservationList";
import TableList from "./TableList";
import { previous, next, today } from "../utils/date-time";
import { useHistory } from "react-router-dom";
import "./Dashboard.css";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({
  date,
  setReservationsError,
  reservationsError,
  reservations,
  tables,
  tablesError,
  loadDashboard,
}) {
  const history = useHistory();

  function dateHandleClick({ target }) {
    if (!date) date = today();

    if (target.name === "previous") {
      history.push(`/dashboard?date=${previous(date)}`);
    }
    if (target.name === "today") {
      history.push(`/dashboard?date=${today()}`);
    }
    if (target.name === "next") {
      history.push(`/dashboard?date=${next(date)}`);
    }
  }

  return (
    <main>
      <div className="d-flex flex-column">
        <div>
          <div className="my-3">
            <h4 className="d-flex justify-content-center">
              Reservations for {date}
            </h4>
          </div>
          <ErrorAlert error={reservationsError} />
          <div className="d-flex justify-content-center">
            <ReservationList
              reservations={reservations}
              loadDashboard={loadDashboard}
            />
          </div>
        </div>
        <div>
          <div className="my-3">
            <h4 className="d-flex justify-content-center">
              Table Availability
            </h4>
          </div>
          <ErrorAlert error={tablesError} />
          <div className="d-flex  justify-content-center">
            <TableList tables={tables} loadDashboard={loadDashboard} />
          </div>
        </div>
      </div>

      <div className="date-buttons d-flex justify-content-center p-2 mt-1  mr-2">
        <button
          type="button"
          name="previous"
          className="btn btn-primary ml-1"
          onClick={dateHandleClick}
        >
          Previous Day
        </button>
        <button
          type="button"
          className="btn btn-success ml-1"
          name="today"
          onClick={dateHandleClick}
        >
          Today
        </button>
        <button
          type="button"
          name="next"
          className="btn btn-secondary ml-1"
          onClick={dateHandleClick}
        >
          Next Day
        </button>
      </div>
    </main>
  );
}

export default Dashboard;
