import React from "react";
import { finishTable } from "../utils/api";
function TableListItem({ table, loadDashboard }) {
  async function handleClick({ target }) {
    const message =
      "Is this table ready to seat new guests? This cannot be undone.";
    const result = window.confirm(message);
    if (result) {
      const abortController = new AbortController();
      await finishTable(table.table_id, abortController.signal);
      loadDashboard();
      return () => abortController.abort();
    }
  }

  function FinishButton() {
    if (table.status === "occupied") {
      return (
        <button
          data-table-id-finish={table.table_id}
          type="button"
          className=" btn btn-sm btn-danger  "
          onClick={handleClick}
        >
          Finish
        </button>
      );
    }
    return null;
  }
  return (
    <>
      <td>{table.table_name}</td>
      <td>{table.capacity}</td>
      <td data-table-id-status={table.table_id}>{table.status}</td>
      <td>
        <FinishButton />
      </td>
    </>

    // <div className="border bg-light border-secondary mt-3">
    //   <h2>{table.table_name}</h2>
    //   <p>Capacity: {table.capacity}</p>
    //   {/* <p className={`data-table-id-status=${table.table_id}`}>
    //     Status: {table.status}
    //   </p> */}
    //   <p className={`data-table-id-status=${table.table_id}`}>
    //     Status: {table.status}
    //   </p>
    //   <FinishButton />
    // </div>
  );
}
export default TableListItem;
