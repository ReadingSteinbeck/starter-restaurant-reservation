import React, { useState } from "react";
import { listReservations } from "../utils/api";
import ReservationList from "../dashboard/ReservationList";

function Search() {
  const [mobileNumber, setMobileNumber] = useState(null);
  const [reservations, setReservations] = useState([]);

  const handleChange = ({ target }) => {
    setMobileNumber(target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const abortController = new AbortController();

    const data = await listReservations(
      { mobile_number: mobileNumber },
      abortController.signal
    );
    setReservations(data);

    return () => abortController.abort();
  };

  return (
    <div>
      <h1>Search Reservation</h1>
      <form onSubmit={handleSubmit}>
        <div className="d-flex  flex-column p-3 ">
          <label className="bg-light p-2 mt-1 " htmlFor="mobile_number">
            <h3>Mobile Number</h3>
            <input
              name="mobile_number"
              type="tel"
              id="mobile_number"
              value={FormData.mobileNumber}
              onChange={handleChange}
              placeholder="###-###-####"
              required
            />
            <button type="submit" className=" btn btn-primary m-1">
              Find
            </button>
          </label>
        </div>
      </form>
      <div>
        <ReservationList reservations={reservations} />
      </div>
    </div>
  );
}
export default Search;
