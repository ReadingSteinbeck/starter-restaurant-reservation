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
    async function loadReservation() {
      setReservation(await readReservation(reservation_id));
    }
    loadReservation();
  }, [reservation_id]);

  // Handlers
  const handleChange = ({ target }) => {
    setTableId(target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      await seatTable(reservation_id, tableId);
      await changeReservationStatus(reservation_id, "seated");
      loadDashboard();
      history.push(`/dashboard`);
    }
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
      <h1>Seat Reservation</h1>
      <ErrorList />
      <div className="border bg-light border-secondary mt-3">
        <h2>
          Reservation for {reservation.first_name} {reservation.last_name}'s
          party of {reservation.people}
        </h2>
        <p>Date: {reservation.reservation_date}</p>
        <p>Time: {reservation.reservation_time}</p>
        <p>Phone: {reservation.mobile_number}</p>
        <div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="table_id">
              Select a table:
              <select
                name="table_id"
                id="table_id"
                value={tableId}
                onChange={handleChange}
              >
                <option value={0}>Choose a table</option>
                {formSelectOptions}
              </select>
            </label>
            <div className="bg-light p-2 mt-1 ">
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
