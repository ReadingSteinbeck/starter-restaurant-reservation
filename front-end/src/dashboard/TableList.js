import React from "react";
import TableListItem from "./TableListItem";

function TableList({ tables, loadDashboard }) {
  const tableList = tables.map((table) => (
    <li key={table.table_id}>
      <TableListItem table={table} loadDashboard={loadDashboard} />
    </li>
  ));
  return (
    <div>
      <ul>{tableList}</ul>
    </div>
  );
}

export default TableList;
