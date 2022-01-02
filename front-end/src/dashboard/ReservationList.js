import React from "react";
import ReservationListItem from "./ReservationListItem";

function ReservationList({ reservations }) {
  const reservationList = reservations.map((reservation) => (
    <li key={reservation.reservation_id}>
      <ReservationListItem reservation={reservation} />
    </li>
  ));
  return (
    <div>
      <ul>{reservationList}</ul>
    </div>
  );
}

export default ReservationList;
