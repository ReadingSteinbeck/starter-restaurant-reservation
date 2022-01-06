import React, { useState } from "react";
import { postReservation } from "../utils/api";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function NewReservation({
  //setDate,
  loadDashboard,
}) {
  const initialReservationState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };
  const [reservationData, setReservationData] = useState({
    ...initialReservationState,
  });
  const [reservationsError, setReservationsError] = useState(null);
  const history = useHistory();

  //Handlers
  const handleChange = ({ target }) => {
    setReservationData({
      ...reservationData,
      [target.name]:
        target.name === "people" ? parseInt(target.value) : target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //const abortController = new AbortController();

    if (validateForm()) {
      await postReservation(
        reservationData
        //abortController.signal
      );

      loadDashboard();

      history.push(`/dashboard?date=${reservationData.reservation_date}`);
    }
    //return () => abortController.abort();
  };
  //Validations
  const dataErrors = [];

  function getDateAndTimeHelper() {
    const date = new Date();
    let month = date.getMonth() + 1;
    const currentDate = [
      date.getFullYear(),
      month < 10 ? "0" + month : month,
      date.getDate() < 10 ? "0" + date.getDate() : date.getDate(),
    ].join("");
    const currentTime = [
      date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
    ].join("");

    return [currentDate, currentTime];
  }

  function validateForm() {
    let { reservation_time, reservation_date, people } = reservationData;
    const resDate = reservation_date.slice(0, 10).replaceAll("-", "");
    const resTime = parseInt(reservation_time.replaceAll(":", ""));
    const reservationDateAndTime = parseInt(resDate + resTime);
    const [currentDate, currentTime] = getDateAndTimeHelper();
    const now = parseInt(currentDate + currentTime);
    const date = new Date(reservation_date + "T22:00:00");

    //Checks if people is greater than 1
    if (people < 1) {
      dataErrors.push({
        message: `People must be a positive number.`,
      });
      setReservationsError([...dataErrors]);
    }

    //Checks if reservation is during working hours
    if (resTime <= 1030 || resTime >= 2130) {
      dataErrors.push({
        message: `Reservation time must be between 10:30AM and 9:30PM.`,
      });
      setReservationsError([...dataErrors]);
    }

    if (now > reservationDateAndTime) {
      //Checks if reservation is in the future
      dataErrors.push({
        message: `Reservations must be made for a future time.`,
      });
      setReservationsError([...dataErrors]);
    }
    //Checks if reservation is on a tuesday
    if (date.getDay() === 2) {
      dataErrors.push({
        message: `The restaurant is closed on tuesdays.`,
      });
      setReservationsError([...dataErrors]);
    }

    return dataErrors.length === 0;
  }

  function ErrorList() {
    if (reservationsError) {
      const errorList = reservationsError.map((error, id) => (
        <li key={id}>
          <ErrorAlert error={error} />
        </li>
      ));
      return <ul>{errorList}</ul>;
    }
    return null;
  }

  return (
    <div>
      <h1>New Reservation</h1>
      <ErrorList />
      <div>
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
      </div>
    </div>
  );
}

export default NewReservation;
