import React from "react";
import { useHistory } from "react-router-dom";

function ReservationForm({ handleSubmit, handleChange, reservationData }) {
  const history = useHistory();
  return (
    <form onSubmit={handleSubmit}>
      <div className="d-flex  flex-column p-3 ">
        <label className="bg-light p-2 mt-1 " htmlFor="first_name">
          <h3>First Name</h3>
          <input
            name="first_name"
            type="text"
            id="first_name"
            value={reservationData.first_name}
            onChange={handleChange}
            required
          />
        </label>
        <label className="bg-light p-2 mt-1 " htmlFor="last_name">
          <h3>Last Name</h3>
          <input
            name="last_name"
            type="text"
            id="last_name"
            value={reservationData.last_name}
            onChange={handleChange}
            required
          />
        </label>
        <label className="bg-light p-2 mt-1 " htmlFor="mobile_number">
          <h3>Mobile Number</h3>
          <input
            name="mobile_number"
            type="text"
            id="mobile_number"
            value={reservationData.mobile_number}
            onChange={handleChange}
            required
          />
        </label>
        <label className="bg-light p-2 mt-1 " htmlFor="reservation_date">
          <h3>Reservation Date</h3>
          <input
            name="reservation_date"
            type="date"
            id="reservation_date"
            value={reservationData.reservation_date}
            onChange={handleChange}
            required
          />
        </label>
        <label className="bg-light p-2 mt-1 " htmlFor="reservation_time">
          <h3>Reservation Time</h3>
          <input
            name="reservation_time"
            type="time"
            id="reservation_time"
            value={reservationData.reservation_time}
            onChange={handleChange}
            required
          />
        </label>
        <label className="bg-light p-2 mt-1 " htmlFor="people">
          <h3>People</h3>
          <input
            name="people"
            type="number"
            id="people"
            value={reservationData.people}
            onChange={handleChange}
            required
          />
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
      </div>
    </form>
  );
}

export default ReservationForm;
