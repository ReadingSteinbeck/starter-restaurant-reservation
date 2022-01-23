import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  readReservation,
  seatTable,
  changeReservationStatus,
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function SeatReservation({ tables, loadDashboard }) {
  const [reservation, setReservation] = useState("");
  const [tableId, setTableId] = useState(0);
  const [tableError, setTableError] = useState(null);

  const history = useHistory();

  const reservation_id = useParams().reservation_id;
  useEffect(() => {
    const abortController = new AbortController();

    async function loadReservation() {
      try {
        setReservation(
          await readReservation(reservation_id, abortController.signal)
        );
      } catch (error) {
        if (error.name !== "AbortError") setTableError(error);
      }
    }
    loadReservation();
    return () => abortController.abort();
  }, [reservation_id]);

  // Handlers
  const handleChange = ({ target }) => {
    setTableId(target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const abortController = new AbortController();

    if (validateForm()) {
      try {
        await seatTable(reservation_id, tableId, abortController.signal);
        await changeReservationStatus(
          reservation_id,
          "seated",
          abortController.signal
        );
      } catch (error) {
        if (error.name !== "AbortError") setTableError(error);
      }
      loadDashboard();
      history.push(`/dashboard`);
    }
    return () => abortController.abort();
  };
  //Validations
  const dataErrors = [];

  function validateForm() {
    //checks if reservation party is greater than table capacity
    const table = tables.find((table) => table.table_id === Number(tableId));
    if (!table) {
      dataErrors.push({
        message: `Table not found.`,
      });
      setTableError([...dataErrors]);
    } else {
      if (table.capacity < reservation.people) {
        dataErrors.push({
          message: `Party size exceeds table's capacity.`,
        });
        setTableError([...dataErrors]);
      }
    }

    return dataErrors.length === 0;
  }

  function ErrorList() {
    if (tableError) {
      const errorList = tableError.map((error, id) => (
        <li key={id}>
          <ErrorAlert error={error} />
        </li>
      ));
      return <ul>{errorList}</ul>;
    }
    return null;
  }

  const formSelectOptions = tables.map((table) => (
    <option key={table.table_id} value={table.table_id}>
      {table.table_name} - {table.capacity}
    </option>
  ));

  return (
    <div>
      <h1 className="d-flex justify-content-center">Seat Reservation</h1>
      <ErrorList />
      <div className=" border bg-light border-secondary mt-3 ">
        <h2 className="d-flex justify-content-center">
          Seat {reservation.first_name} {reservation.last_name}'s party of{" "}
          {reservation.people}
        </h2>

        <div className="d-flex justify-content-center ">
          Date: {reservation.reservation_date}
        </div>
        <div className="d-flex justify-content-center ">
          Time: {reservation.reservation_time}
        </div>
        <div className="d-flex justify-content-center ">
          Phone: {reservation.mobile_number}
        </div>

        <div>
          <form onSubmit={handleSubmit}>
            <div className="d-flex justify-content-center ">
              <label htmlFor="table_id">
                <select
                  className="custom-select"
                  name="table_id"
                  id="table_id"
                  value={tableId}
                  onChange={handleChange}
                >
                  <option value={0}>Choose a table</option>
                  {formSelectOptions}
                </select>
              </label>
            </div>
            <div className="bg-light p-2 mt-1 d-flex justify-content-center">
              <button
                type="button"
                className=" btn btn-secondary m-1"
                onClick={() => history.goBack()}
              >
                Cancel
              </button>
              <button type="submit" className=" btn btn-primary m-1">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SeatReservation;
