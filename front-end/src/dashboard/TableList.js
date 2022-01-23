import React from "react";
import TableListItem from "./TableListItem";

function TableList({ tables, loadDashboard }) {
  const tableList = tables.map((table) => (
    <tr key={table.table_id}>
      <TableListItem table={table} loadDashboard={loadDashboard} />
    </tr>
  ));
  return (
    <div>
      <table className="table table-responsive  align-content-center">
        <thead>
          <tr>
            <th>Table</th>
            <th>Capacity</th>
            <th>Status</th>
            <th>Finish</th>
          </tr>
        </thead>
        <tbody>{tableList}</tbody>
      </table>
    </div>
  );
}
export default TableList;
