import React from "react";

import ErrorAlert from "../layout/ErrorAlert";
import ReservationList from "./ReservationList";
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
  setDate,
  setReservationsError,
  reservationsError,
  reservations,
}) {
  const history = useHistory();

  function dateHandleClick({ target }) {
    if (target.name === "previous") {
      setDate(previous(date));
    }
    if (target.name === "today") {
      setDate(today());
    }
    if (target.name === "next") {
      setDate(next(date));
    }
    history.push(`/dashboard?date=${date}`);
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <ErrorAlert error={reservationsError} />

      <ReservationList reservations={reservations} />

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
