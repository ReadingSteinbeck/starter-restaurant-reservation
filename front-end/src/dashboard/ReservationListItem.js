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
            className="btn btn-sm btn-success"
            onClick={{ handleSeatClick }}
          >
            Seat
          </button>
        </a>
      );
    }
    return null;
  }
  //Handler
  async function handleSeatClick({ target }) {
    const abortController = new AbortController();
    await changeReservationStatus(
      reservation.reservation_id,
      "seated",
      abortController.signal
    );
    loadDashboard();
    return () => abortController.abort();
  }

  return (
    <>
      <td>
        {reservation.first_name} {reservation.last_name}
      </td>
      <td>{reservation.people}</td>
      <td> {reservation.reservation_date}</td>
      <td> {reservation.reservation_time}</td>
      <td> {reservation.mobile_number}</td>
      <td>
        <p data-reservation-id-status={reservation.reservation_id}>
          {reservation.status}
        </p>
        <SeatButton />
      </td>
    </>
  );
}

export default ReservationListItem;
