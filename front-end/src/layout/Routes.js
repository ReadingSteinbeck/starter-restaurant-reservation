import React, { useState, useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import NewReservation from "../reservations/NewReservation";
import NewTable from "../tables/NewTable";
import { today } from "../utils/date-time";
import { listReservations } from "../utils/api";
/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const [date, setDate] = useState(today());
  const [reservationsError, setReservationsError] = useState(null);
  const [reservations, setReservations] = useState([]);
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/reservations/new">
        <NewReservation setDate={setDate} />
      </Route>
      <Route path="/tables/new">
        <NewTable />
      </Route>
      <Route exact={true} path="/dashboard">
        <Dashboard
          date={date}
          setDate={setDate}
          setReservationsError={setReservationsError}
          reservationsError={reservationsError}
          reservations={reservations}
        />
      </Route>

      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
