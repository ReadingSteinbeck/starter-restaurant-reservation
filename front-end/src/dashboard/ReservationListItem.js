import React from "react";
import { changeReservationStatus } from "../utils/api";

function ReservationListItem({ reservation, loadDashboard }) {
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
    const message =
      "Do you want to cancel this reservation? This cannot be undone.";
    const result = window.confirm(message);
    if (result) {
      const abortController = new AbortController();
      await changeReservationStatus(
        reservation.reservation_id,
        "cancelled",
        abortController.signal
      );
      loadDashboard();
      return () => abortController.abort();
    }
  }

  if (reservation.status !== "cancelled")
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
          <div>
            <SeatButton />
            <EditButton reservation={reservation} />
            <CancelButton />
          </div>
        </td>
      </>
    );
  return null;
}

export default ReservationListItem;
