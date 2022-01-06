import React from "react";
import TableListItem from "./TableListItem";

// function TableList({ tables, loadDashboard }) {
//   const tableList = tables.map((table) => (
//     <li key={table.table_id}>
//       <TableListItem table={table} loadDashboard={loadDashboard} />
//     </li>
//   ));
//   return (
//     <div>
//       <ul>{tableList}</ul>
//     </div>
//   );
// }

function TableList({ tables, loadDashboard }) {
  const tableList = tables.map((table) => (
    <tr key={table.table_id}>
      <TableListItem table={table} loadDashboard={loadDashboard} />
    </tr>
  ));
  return (
    <div>
      <table className="table table-sm-responsive  align-content-center">
        <thead>
          <tr>
            <th>Table Name</th>
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
