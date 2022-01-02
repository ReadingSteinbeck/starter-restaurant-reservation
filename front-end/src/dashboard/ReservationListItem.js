import React from "react";

function ReservationListItem({ reservation }) {
  return (
    <div className="border bg-light border-secondary mt-3">
      <h2>
        Reservation for {reservation.first_name} {reservation.last_name}'s party
        of {reservation.people}
      </h2>
      <p>Date: {reservation.reservation_date}</p>
      <p>Time: {reservation.reservation_time}</p>
      <p>Phone: {reservation.mobile_number}</p>
    </div>
  );
}

export default ReservationListItem;
