import React from "react";
import ReservationListItem from "./ReservationListItem";

function ReservationList({ reservations }) {
  const reservationList = reservations.map((reservation) => (
    <tr key={reservation.reservation_id}>
      <ReservationListItem reservation={reservation} />
    </tr>
  ));
  return (
    <div>
      <table className="table table-sm-responsive ">
        <thead>
          <tr>
            <th>Name</th>
            <th>Party Size</th>
            <th>Date</th>
            <th>Time</th>
            <th>Phone</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>{reservationList}</tbody>
      </table>
    </div>
  );
}

export default ReservationList;

// function ReservationList({ reservations }) {
//   const reservationList = reservations.map((reservation) => (
//     <li key={reservation.reservation_id}>
//       <ReservationListItem reservation={reservation} />
//     </li>
//   ));
//   return (
//     <div>
//       <ul>{reservationList}</ul>
//     </div>
//   );
// }
