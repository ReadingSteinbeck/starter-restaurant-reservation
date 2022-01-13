import React, { useState, useEffect } from "react";
import {
  postReservation,
  readReservation,
  updateReservation,
} from "../utils/api";
import { useHistory, useParams } from "react-router-dom";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../layout/ErrorAlert";

function NewReservation({ loadDashboard, edit }) {
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
  const { reservation_id } = useParams();

  //Loads reservation data if editing reservation.
  useEffect(() => {
    const abortController = new AbortController();
    if (edit) {
      async function loadReservation() {
        try {
          const data = await readReservation(
            reservation_id,
            abortController.signal
          );

          data.reservation_time = data.reservation_time.slice(0, -3);

          setReservationData({ ...data });
        } catch (error) {
          if (error.name !== "AbortError") throw error;
        }
      }
      loadReservation();
      return () => abortController.abort();
    }
  }, [edit, reservation_id]);

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
    console.log(reservationData.reservation_date);
    console.log(reservationsError);

    const abortController = new AbortController();
    if (edit) {
      try {
        if (validateForm()) {
          await updateReservation(reservationData, abortController.signal);
          loadDashboard();
          history.push(`/dashboard?date=${reservationData.reservation_date}`);
        }
      } catch (error) {
        if (error.name !== "AbortError") console.log(error);
      }
    } else {
      console.log(validateForm());
      if (validateForm()) {
        console.log(`Passed Validation`);
        try {
          console.log("Inside Try", reservationData.reservation_date);

          await postReservation(reservationData, abortController.signal);
          loadDashboard();

          history.push(`/dashboard?date=${reservationData.reservation_date}`);
        } catch (error) {
          console.log(`Activated Catch`);
          if (error.name !== "AbortError") console.log(error);
        }
      }
    }
    return () => abortController.abort();
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
    const resDate = reservation_date.slice(0, 10).replace(/-/g, "");
    const resTime = parseInt(reservation_time.replace(/:/g, ""));
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
        <ReservationForm
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          reservationData={reservationData}
        />
      </div>
    </div>
  );
}

export default NewReservation;
