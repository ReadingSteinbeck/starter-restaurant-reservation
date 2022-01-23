import React from "react";
import { changeReservationStatus } from "../utils/api";
import useMediaQuery from "../utils/useMediaQuery";

function ReservationListItem({ reservation, loadDashboard }) {
  const isDesktop = useMediaQuery("(min-width: 800px)");
  function SeatButton() {
    if (reservation.status === "booked") {
      return (
        <a href={`/reservations/${reservation.reservation_id}/seat`}>
          <button
            type="button"
            name="seat"
            className="btn btn-sm btn-success ml-1"
          >
            Seat
          </button>
        </a>
      );
    }
    return null;
  }

  function EditButton() {
    if (reservation.status === "booked")
      return (
        <a href={`/reservations/${reservation.reservation_id}/edit`}>
          <button
            type="button"
            name="edit"
            className="btn btn-sm btn-warning ml-1"
          >
            Edit
          </button>
        </a>
      );
    return null;
  }
  function CancelButton() {
    return (
      <button
        type="button"
        name="cancel"
        className="btn btn-sm btn-danger ml-1"
        onClick={handleCancelClick}
        data-reservation-id-cancel={reservation.reservation_id}
      >
        Cancel
      </button>
    );
  }
  //Handler

  async function handleCancelClick() {
    const abortController = new AbortController();
    try {
      const message =
        "Do you want to cancel this reservation? This cannot be undone.";
      const result = window.confirm(message);
      if (result) {
        await changeReservationStatus(
          reservation.reservation_id,
          "cancelled",
          abortController.signal
        );
        loadDashboard();
      }
    } catch (error) {
      if (error.name !== "AbortError") errorList.push(error);
    }
    return () => abortController.abort();
  }
  const errorList = [];

  if (reservation.status !== "cancelled") {
    if (isDesktop)
      return (
        <>
          <td>
            {reservation.first_name} {reservation.last_name}
          </td>
          <td>{reservation.people}</td>
          <td> {reservation.reservation_date}</td>
          <td> {reservation.reservation_time}</td>
          <td> {reservation.mobile_number}</td>
          <td data-reservation-id-status={reservation.reservation_id}>
            {reservation.status}
          </td>
          <td>
            <SeatButton />
            <EditButton reservation={reservation} />
            <CancelButton />
          </td>
        </>
      );
    return (
      <div className="reservation-item d-flex flex-column justify-content-center bg-info rounded m-2 p-2">
        <h7 className=" d-flex justify-content-center text-white">
          {reservation.first_name} {reservation.last_name}
        </h7>

        <div className="d-flex flex-row   justify-content-center">
          <div className="mt-1">
            <SeatButton />
          </div>
          <div className="mt-1">
            <EditButton reservation={reservation} />
          </div>
          <div className="mt-1">
            <CancelButton />
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export default ReservationListItem;
