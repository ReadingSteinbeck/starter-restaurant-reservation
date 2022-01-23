import React from "react";
import ReservationListItem from "./ReservationListItem";
import useMediaQuery from "../utils/useMediaQuery";

function ReservationList({ reservations, loadDashboard }) {
  const isDesktop = useMediaQuery("(min-width: 800px)");

  const reservationListTable = reservations.map((reservation) => (
    <tr key={reservation.reservation_id}>
      <ReservationListItem
        reservation={reservation}
        loadDashboard={loadDashboard}
      />
    </tr>
  ));
  const reservationListMobile = reservations.map((reservation) => (
    <div key={reservation.reservation_id}>
      <ReservationListItem
        reservation={reservation}
        loadDashboard={loadDashboard}
      />
    </div>
  ));
  if (reservations.length > 0) {
    if (isDesktop)
      return (
        <div>
          <table className="table table-responsive ">
            <thead>
              <tr>
                <th>Name</th>
                <th>Party</th>
                <th>Date</th>
                <th>Time</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>{reservationListTable}</tbody>
          </table>
        </div>
      );
    return (
      <div className="d-flex flex-wrap justify-content-center ">
        {reservationListMobile}
      </div>
    );
  }
  return (
    <h5 className="d-flex justify-content-center">No reservations found</h5>
  );
}

export default ReservationList;
