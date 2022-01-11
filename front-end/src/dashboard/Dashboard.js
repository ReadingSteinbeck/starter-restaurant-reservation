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
          <div className="d-md-flex mb-3">
            <h4 className="mb-0">Reservations for date</h4>
          </div>
          <ErrorAlert error={reservationsError} />

          <ReservationList
            reservations={reservations}
            loadDashboard={loadDashboard}
          />
        </div>
        <div>
          <div className="d-md-flex mb-3">
            <h4 className="mb-0">Table Availability</h4>
          </div>
          <ErrorAlert error={tablesError} />
          <TableList tables={tables} loadDashboard={loadDashboard} />
        </div>
      </div>

      <div className="date-buttons">
        <button
          type="button"
          name="previous"
          className="btn btn-primary"
          onClick={dateHandleClick}
        >
          Previous Day
        </button>
        <button
          type="button"
          className="btn btn-success"
          name="today"
          onClick={dateHandleClick}
        >
          Today
        </button>
        <button
          type="button"
          name="next"
          className="btn btn-secondary"
          onClick={dateHandleClick}
        >
          Next Day
        </button>
      </div>
    </main>
  );
}

export default Dashboard;
