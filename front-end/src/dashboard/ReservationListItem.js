import React from "react";

function ReservationListItem({ reservation }) {
  return (
    <div className="border bg-light border-secondary mt-3">
      <h2>
        {reservation.first_name} {reservation.last_name}'s party of{" "}
        {reservation.people}
      </h2>
      <p>Date: {reservation.reservation_date}</p>
      <p>Time: {reservation.reservation_time}</p>
      <p>Phone: {reservation.mobile_number}</p>
      <div>
        <a href={`/reservations/${reservation.reservation_id}/seat`}>
          <button type="button" name="seat" className="btn btn-success">
            Seat
          </button>
        </a>
      </div>
    </div>
  );
}

export default ReservationListItem;
