import React from "react";
import { finishTable } from "../utils/api";
function TableListItem({ table, loadDashboard }) {
  async function handleClick({ target }) {
    const abortController = new AbortController();
    try {
      const message =
        "Is this table ready to seat new guests? This cannot be undone.";
      const result = window.confirm(message);
      if (result) {
        await finishTable(table.table_id, abortController.signal);
        loadDashboard();
      }
    } catch (error) {
      if (error.name !== "AbortError") throw error;
    }
    return () => abortController.abort();
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
  );
}
export default TableListItem;
