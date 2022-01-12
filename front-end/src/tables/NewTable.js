import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { postTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function NewTable({ loadDashboard }) {
  const initialTableState = {
    table_name: "",
    capacity: "",
  };
  const [tableData, setTableData] = useState({
    ...initialTableState,
  });
  const [tablesError, setTablesError] = useState(null);
  const history = useHistory();

  //Handlers
  const handleChange = ({ target }) => {
    setTableData({
      ...tableData,
      [target.name]:
        target.name === "capacity" ? parseInt(target.value) : target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const abortController = new AbortController();
    if (validateForm()) {
      await postTable(tableData, abortController.signal);
      loadDashboard();
      history.push("/");
    }
    return () => abortController.abort();
  };

  //Validations
  const dataErrors = [];

  function validateForm() {
    let { table_name, capacity } = tableData;

    //Checks if capacity is 1 or more
    if (capacity < 1 || capacity.length === 0) {
      dataErrors.push({
        message: `Table capacity must be greater than or equal to 1.`,
      });
      setTablesError([...dataErrors]);
    }

    //Checks if table_name is atleast two characters long
    if (table_name.length < 2) {
      dataErrors.push({
        message: `Table Name must be atleast two characters long.`,
      });
      setTablesError([...dataErrors]);
    }
    return dataErrors.length === 0;
  }

  function ErrorList() {
    if (tablesError) {
      const errorList = tablesError.map((error, id) => (
        <li key={id}>
          <ErrorAlert error={error} />
        </li>
      ));
      return <ul>{errorList}</ul>;
    }
    return null;
  }
  return (
    <div>
      <h1>New Table</h1>
      <ErrorList />
      <div>
        <form onSubmit={handleSubmit}>
          <div className="d-flex  flex-column p-3 ">
            <label className="bg-light p-2 mt-1 " htmlFor="first_name">
              <h3>Table Name</h3>
              <input
                name="table_name"
                type="text"
                id="table_name"
                value={tableData.table_name}
                onChange={handleChange}
                required
              />
            </label>
            <label className="bg-light p-2 mt-1 " htmlFor="people">
              <h3>Capacity</h3>
              <input
                name="capacity"
                type="number"
                id="capacity"
                value={tableData.capacity}
                onChange={handleChange}
                required
              />
            </label>

            <div className="bg-light p-2 mt-1 ">
              <button
                type="button"
                className=" btn btn-secondary m-1"
                onClick={() => history.goBack()}
              >
                Cancel
              </button>
              <button type="submit" className=" btn btn-primary m-1">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
export default NewTable;
