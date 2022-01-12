import React from "react";
import ReservationListItem from "./ReservationListItem";

function ReservationList({ reservations, loadDashboard }) {
  const reservationList = reservations.map((reservation) => (
    <tr key={reservation.reservation_id}>
      <ReservationListItem
        reservation={reservation}
        loadDashboard={loadDashboard}
      />
    </tr>
  ));
  if (reservations.length > 0) {
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
  return <h5>No reservations found</h5>;
}

export default ReservationList;
